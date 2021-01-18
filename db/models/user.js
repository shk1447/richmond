const { DataTypes } = require('sequelize');

module.exports = function(sequelize) {
  const User = sequelize.define('User', {
    // Model attributes are defined here
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING
      // allowNull defaults to true
    }
  }, {
    // Other model options go here
  });

  User.sync({force:true}).then((res) => {
    console.log(res);
  })
}