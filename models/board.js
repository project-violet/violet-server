// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('board', {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ShortName: DataTypes.STRING(50),
    Name: DataTypes.STRING(50),
    Description: {
      type: DataTypes.STRING(500),
      defaultValue: null,
    },
  });
};