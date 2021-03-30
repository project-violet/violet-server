// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    Pid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Id: DataTypes.STRING(50),
    Password: DataTypes.STRING(150),
    UserAppID: DataTypes.STRING(150),
    NickName: DataTypes.STRING(50),
    Etc: DataTypes.STRING(150),
  });
};