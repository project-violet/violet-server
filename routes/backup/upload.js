// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const config = require("config");
const logger = require("../../etc/logger");
const r_auth = require("../../auth/auth");
const aws_s3_new = require("../../api/aws-s3-new");

module.exports = async function upload(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type("json").send({ msg: "forbidden" });
    return;
  }

  if (req.body["data"] == null || req.body["user"] == null) {
    res.status(400).type("json").send({ msg: "bad request" });
    return;
  }

  let user = req.body["user"];
  let fn = req.body["fn"];
  let data = req.body["data"];

  logger.info("upload-append %s %s", user, fn);

  var param = {
    Bucket: "violet-user-data-backup",
    Key: user + "-" + fn,
    ACL: "public-read",
    Body: data,
    ContentType: "text/json",
  };

  aws_s3_new.upload(param, function (err, data) {
    if (err) {
      logger.error("upload-file-s3: %s %s", user, fn);
      logger.error(err);
    }
  });
};
