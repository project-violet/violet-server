// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const config = require("config");
const logger = require("../../etc/logger");
const r_auth = require("../../auth/auth");
const aws_s3 = require("../../api/aws-s3");

const bucket_name = config.get("upload.bookmark.bucket");

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
  let data = req.body["data"];

  logger.info("upload-append %s", user);

  var param = {
    Bucket: bucket_name,
    Key: "bookmark-" + user,
    ACL: "public-read",
    Body: data,
    ContentType: "text/json",
  };

  aws_s3.upload(param, function (err, data) {
    if (err) {
      logger.error("upload-bookmark-s3: %s", user);
      logger.error(err);
      res.status(500).type("json").send({ msg: "internal server error" });
      return;
    }
    res.status(200).type("json").send({ msg: "success" });
  });
};
