// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const logger = require('../etc/logger');
const r_auth = require("../auth/auth");
const path = require('path');
const fs = require('fs');

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
  const dataPath = path.resolve(__dirname, 'data', user + '.json');

  logger.info('upload-append %s', user);

  fs.unlinkSync(dataPath);
  fs.writeFile(dataPath, data, function(err) {
      logger.error('fail-upload %s', user);
      logger.error(err);
  });

  res.status(200).type("json").send({ msg: "success" });
};
