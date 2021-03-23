const fs = require('fs');
const path = require('path');

const { app, BrowserWindow, ipcMain } = require('electron');

process.env.root_path = path.resolve(__dirname);

ipcMain.on('asynchronous-message', (event, arg) => {
  var hh = fs.readFileSync(path.resolve(__dirname, arg.load ? './demo_load.json' : './demo_predict.json'));

  event.sender.send('asynchronous-reply', hh)

  console.log(arg)
})

// ipcMain.on('synchronous-message', (event, arg) => {
//     console.log(arg)  // "ping" 출력
//     event.returnValue = 'pong'
// })

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 1600,
    minHeight: 900,
    width: 1600,
    height: 900,
    kiosk: false,
    fullscreen: false,
    fullscreenable: true,
    resizable: true,
    frame: false,
    show: false
  });

  mainWindow.loadURL('file://' + __dirname + '/dist/index.html');

  mainWindow.webContents.openDevTools();

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  })
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  /* python 연동에 필요한 조각 코드 */
  // runtime.exec.run('setup-python.bat', [], {
  //     cwd:path.resolve(__dirname, './dist/setup-python')
  // }).then(function() {
  //     console.log('complete prequesite')
  // }).catch(function(err) {
  //     console.log(err)
  // }).finally(function() {
  /* python 연동에 필요한 조각 코드 */
}

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') app.quit();
});

app.on('ready', createWindow);

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
