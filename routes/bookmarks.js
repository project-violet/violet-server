// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const config = require("config");
const logger = require("../etc/logger");
const r_auth = require("../auth/auth");
const aws_s3 = require("../api/aws-s3");

const bucket_name = config.get("upload.bookmark.bucket");

module.exports = async function bookmarks(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type("json").send({ msg: "forbidden" });
    return;
  }

  var param = {
    Bucket: bucket_name,
  };

  aws_s3.listObjects(param, function (err, data) {
    var c = data.Contents;
    c.sort((a, b) => b.Size - a.Size);
    res
      .status(200)
      .type("json")
      .send({
        msg: "success",
        result: data.Contents.map((x) => {
          return { size: x.Size, user: x.Key.split("-")[1] };
        }),
      });
  });
};
