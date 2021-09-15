// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const r_auth = require("../../auth/auth");
const request = require("request");

module.exports = async function (req, res, next) {
//   if (!r_auth.wauth(req)) {
//     res.status(403).type("html").send(p.p403);
//     return;
//   }

  request(
    "http://127.0.0.1:8864" + req.path.substr(4),
    (error, response, body) => {
      try {
        res.status(400).type("json").send(body);
      } catch (e) {
        res.status(500).type("json").send({ msg: "internal server error" });
      }
    }
  );
};
