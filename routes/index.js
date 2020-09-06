// This source code is a part of Project Violet.
// Copyright (C) 2020. violet-team. Licensed under the Apache-2.0 License.

var express = require("express");
var router = express.Router();

router.get("/", empty);
function empty(req, res, next) {
  res
    .type("json")
    .send({
      msg:
        "hello " +
        (req.headers["x-forwarded-for"] || req.connection.remoteAddress) +
        ", violet api server!",
    });
}

module.exports = router;