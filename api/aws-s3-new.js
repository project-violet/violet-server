// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const config = require("config");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: config.get("awsnew.accessKeyId"),
  secretAccessKey: config.get("awsnew.secretAccessKey"),
  region: config.get("awsnew.region"),
});

module.exports = s3;
