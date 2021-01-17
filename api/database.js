// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const mysql = require("mysql");
const config = require("config");

const host = config.get("db.host");
const port = config.get("db.port");
const user = config.get("db.user");
const password = config.get("db.password");
const database = config.get("db.database");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: host,
  port: port,
  user: user,
  password: password,
  database: database,
});

module.exports = function () {
  return pool;
};
