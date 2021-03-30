// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('voterecord', {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ArticleId: DataTypes.INTEGER,
    User: DataTypes.INTEGER,
    TimeStamp: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    Body: DataTypes.STRING(500),
    Parent: DataTypes.INTEGER,
  });
};