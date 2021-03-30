// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserId: DataTypes.STRING(50),
    Password: DataTypes.STRING(150),
    TimeStamp: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    Status: DataTypes.STRING(11),
  });
};