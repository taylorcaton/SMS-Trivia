module.exports = function(sequelize, DataTypes) {
  var Question = sequelize.define("Question", {
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    difficulty: {
      type: DataTypes.STRING,
      allowNull: false
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false
    },
    answer1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    answer2: {
      type: DataTypes.STRING,
      allowNull: false
    },
    answer3: {
      type: DataTypes.STRING,
      allowNull: false
    },
    answer4: {
      type: DataTypes.STRING,
      allowNull: false
    },
    correct_answer:{
      type: DataTypes.STRING,
      allowNull: false
    },
    correct_letter:{
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Question;
};
