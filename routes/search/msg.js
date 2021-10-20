// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

// const request = require("request");
const request = require("request-promise");
const config = require("config");

const r_auth = require("../../auth/auth");

const msgHost0 = config.get("message.host0") || "http://127.0.0.1:8864";
const msgHost1 = config.get("message.host1") || "http://127.0.0.1:8864";

module.exports = async function (req, res, next) {
  //   if (!r_auth.wauth(req)) {
  //     res.status(403).type("html").send(p.p403);
  //     return;
  //   }

  try {
    var urls = [msgHost0 + req.path.substr(4), msgHost1 + req.path.substr(4)];
    const promises = urls.map((url) => request(url));
    Promise.all(promises).then((data) => {
      var p0 = JSON.parse(data[0]);
      var p1 = JSON.parse(data[1]);

      p1.forEach(function (row) {
        p0.push(row);
      });

      p0.sort(function (a, b) {
        return parseInt(b.MatchScore) - parseInt(a.MatchScore);
      });

      res.status(200).type("json").send(body);
    });
  } catch (e) {
    res.status(500).type("json").send({ msg: "internal server error" });
  }

  // request(msgHost + req.path.substr(4), (error, response, body) => {
  //   try {
  //     res.status(200).type("json").send(body);
  //   } catch (e) {
  //     res.status(500).type("json").send({ msg: "internal server error" });
  //   }
  // });
};
