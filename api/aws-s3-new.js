// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const config = require("config");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: config.get("aws-new.accessKeyId"),
  secretAccessKey: config.get("aws-new.secretAccessKey"),
  region: config.get("aws-new.region"),
});

module.exports = s3;
