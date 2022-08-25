// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const elasticsearch = require('@elastic/elasticsearch');
const config = require("config");

const host = config.get("es.host");

const client = new elasticsearch.Client({
  node = host,
});

module.exports = client;