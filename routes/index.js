// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const express = require("express");
const router = express.Router();

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
