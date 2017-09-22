module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        len: [1]
      },
      avatar: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "https://www.drupal.org/files/issues/default-avatar.png"
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      lastScore:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      }
    });
  
    return User;
  };
  