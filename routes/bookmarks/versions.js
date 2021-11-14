// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const config = require("config");
const logger = require("../../etc/logger");
const r_auth = require("../../auth/auth");
const aws_s3 = require("../../api/aws-s3");

const bucket_name = config.get("upload.bookmark.bucket");

module.exports = async function versions(req, res, next) {
  // if (!r_auth.auth(req)) {
  //   res.status(403).type("json").send({ msg: "forbidden" });
  //   return;
  // }

  if (req.query["user"] == null) {
    res.status(400).type("json").send({ msg: "bad request" });
    return;
  }

  let user = req.query["user"];

  logger.info("bookmark-versions %s", user);

  var param = {
    Bucket: bucket_name,
    Prefix: "bookmark-" + user,
  };

  aws_s3.listObjectVersions(param, function (err, data) {
    if (err) {
      console.log(err);
      res.status(404).type("json").send({ msg: "not found" });
      return;
    }

    res
      .status(200)
      .type("json")
      .send({
        msg: "success",
        result: data.Versions.map((x) => {
          return { vid: x.VersionId, latest: x.IsLatest, dt: x.LastModified, size: x.Size };
        }),
      });
  });
};
