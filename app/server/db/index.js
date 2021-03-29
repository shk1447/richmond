

const Models = require('./models');
const { Sequelize } = require('sequelize')

module.exports = async function() {
    const sequelize = new Sequelize({
        dialect:'sqlite',
        storage:'./richmond.db'
    })

    await sequelize.authenticate();

    var models = new Models(sequelize);

    return models;
}
