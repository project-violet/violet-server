// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const config = require("config");
const logger = require("../etc/logger");
const r_auth = require("../auth/auth");
const aws_s3 = require("../api/aws-s3");

const bucket_name = config.get("upload.bookmark.bucket");

module.exports = async function restore(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type("json").send({ msg: "forbidden" });
    return;
  }

  if (req.query["user"] == null) {
    res.status(400).type("json").send({ msg: "bad request" });
    return;
  }

  let user = req.query["user"];

  logger.info("upload-restore %s", user);

  var param = {
    Bucket: bucket_name,
    Key: "bookmark-" + user,
  };

  aws_s3.getObject(param, function (err, data) {
    try {
      if (err && err.code == "NoSuchKey") {
        res.status(404).type("json").send({ msg: "not found" });
        return;
      }
      if (err) {
        logger.error("upload-bookmark-s3: %s", user);
        logger.error(err);
        res.status(500).type("json").send({ msg: "internal server error" });
        return;
      }
      res
        .status(200)
        .type("json")
        .send({ msg: "success", result: JSON.parse(data.Body.toString()) });
    } catch (e) {
      logger.error("upload-bookmark: %s", user);
      logger.error(e);
      res.status(500).type("json").send({ msg: "internal server error" });
    }
  });
};
