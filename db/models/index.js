const User = require('./user.js')

module.exports = function(sequelize) {
  var user = new User(sequelize);

  return {
    user:user
  };
}