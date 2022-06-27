// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

// const request = require("request");
const request = require("request-promise");
const config = require("config");

const logger = require("../../etc/logger");
const r_auth = require("../../auth/auth");

const msgHost0 = config.get("message.host0") || "http://127.0.0.1:8864";
const msgHost1 = config.get("message.host1") || "http://127.0.0.1:8864";
const msgHost2 = config.get("message.host2") || "http://127.0.0.1:8864";

module.exports = async function (req, res, next) {
  //   if (!r_auth.wauth(req)) {
  //     res.status(403).type("html").send(p.p403);
  //     return;
  //   }

  try {
    var q = req.path.substr(4);
//    var urls = [msgHost0 + q, msgHost1 + q, msgHost2 + q];
    var urls = [msgHost0 + q];
    logger.info("search: " + q);
    const promises = urls.map((url) => request(url));
    Promise.all(promises).then((data) => {
/*      if (q != "/rank") {
        var p0 = JSON.parse(data[0]);
        var p1 = JSON.parse(data[1]);
        var p2 = JSON.parse(data[2]);

        p1.forEach(function (row) {
          p0.push(row);
        });
        
        p2.forEach(function (row) {
          p0.push(row);
        });

        p0.sort(function (a, b) {
          return parseFloat(b.MatchScore) - parseFloat(a.MatchScore);
        });

        res.status(200).type("json").send(p0.slice(0, parseInt((p0.length + p1.length + p2.length) / 3)));
      } else {
        res
          .status(200)
          .type("txt")
          .send(data[0] + "\n" + data[1]);
      }*/
	res.status(200).type("json").send(data[0]);
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
