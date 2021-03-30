// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('article', {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    TimeStamp: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    User: DataTypes.INTEGER,
    Comments: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    Title: DataTypes.STRING(50),
    Body: DataTypes.STRING(5000),
    Etc: DataTypes.STRING(5000),
    Board: DataTypes.INTEGER,
    View: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    UpVote: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    DownVote: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  });
};