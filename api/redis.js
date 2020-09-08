// This source code is a part of Project Violet.
// Copyright (C) 2020. violet-team. Licensed under the Apache-2.0 License.

const Redis = require('ioredis');
const config = require('config');

const host = config.get('redis.host');
const port = config.get('redis.port');
const family = config.get('redis.family') || 4;
const username = config.get('redis.username');
const password = config.get('redis.password');
const db = config.get('redis.db');

var redis = new Redis({
  host: host,
  port: port,
  family: family,
  username: username,
  password: password,
  db: db,
});

module.exports = redis;