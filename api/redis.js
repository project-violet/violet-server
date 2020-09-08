// This source code is a part of Project Violet.
// Copyright (C) 2020. violet-team. Licensed under the Apache-2.0 License.

const Redis = require('ioredis');
const config = require('config');

const host = config.get('redis.host');
const port = config.get('redis.port');

var redis = new Redis({
  host: host,
  port: port,
});

module.exports = redis;