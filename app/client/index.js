
const cmd = require('commander');
const path = require('path');
const webpack = require('webpack');

cmd.option('-m, --mode [mode]', 'set mode', 'development')
  .option('-p, --port [port]', 'set port', '8080')
  .option('-P, --proxy [host]', 'set proxy host', 'http://localhost:8081')
  .option('-r, --reload [reload]', 'hot reload option', 'true')
  .parse(process.argv);

// 사용자 정의 config
process.env.mode = cmd.mode;
process.env.NODE_ENV = 'production';
process.env.port = cmd.port;
process.env.proxy = cmd.proxy;
process.env.reload = cmd.reload;
process.env.root_path = path.resolve(__dirname, '../dist');

const webpackConfig = require('./bundler/webpack.prod.conf.js');


const fs = require('fs');
const ora = require('ora');
const rm = require('rimraf');
const chalk = require('chalk');

if (process.env.mode === 'production') {
  const spinner = ora('building for production...');
  spinner.start();
  new Promise((resolve, reject) => {
    rm(process.env.root_path, err => {
      if (err) throw err;
      webpack(webpackConfig, (err, stats) => {
        spinner.stop();
        if (err) throw err;
        process.stdout.write(stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false
        }) + '\n\n');

        if (stats.hasErrors()) {
          console.log(chalk.red('  Build failed with errors.\n'));
          process.exit(1)
        }

        resolve();
      })
    })
  }).then(() => {
    console.log(chalk.cyan('  Build complete.\n'));
  })
} else {
  const express = require('express');
  const http = require('http');
  const proxy = require('express-http-proxy');
  const httpProxy = require('http-proxy');
  const apiProxy = httpProxy.createProxyServer();
  const compiler = webpack(webpackConfig);
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require("webpack-hot-middleware");

  let app = express();

  app.use('/', webpackDevMiddleware(compiler, {
    hot: true,
    inline: true,
    historyApiFallback: true,
    stats: {
      colors: true
    },
    publicPath: '/',
    overlay: true
  }));

  if (process.env.reload) {
    app.use('/', webpackHotMiddleware(compiler));
  }

  if (process.env.proxy) app.use('/', proxy(process.env.proxy));

  let server = http.createServer(app);
  server.listen(process.env.port, function () {
    console.log('Server listening on ' + process.env.port + ', Ctrl+C to stop');
  }).on('error', function (err) {
    console.log(err.message);
  });

  server.on('upgrade', function (req, socket, head) {
    if (process.env.proxy) apiProxy.ws(req, socket, head, { target: process.env.proxy });
  });
}
