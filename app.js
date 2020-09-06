//===----------------------------------------------------------------------===//
//
//                            Violet API Server
//
//===----------------------------------------------------------------------===//
//
//  Copyright (C) 2020. violet-team. All Rights Reserved.
//
//===----------------------------------------------------------------------===//

const express = require("express");
const createError = require("http-errors");
const expressDefend = require("express-defend");
const blacklist = require("express-blacklist");
const rateLimit = require("express-rate-limit");

const r_index = require("./routes/index");
const r_read = require("./routes/read");
const r_top = require("./routes/top");
const r_view = require("./routes/view");
const r_write = require("./routes/write");

const app = express();

app.use(express.json());

// Ban ip address
app.use(blacklist.blockRequests("blacklist.txt"));
app.use(
  expressDefend.protect({
    maxAttempts: 1,
    dropSuspiciousRequest: true,
    onMaxAttemptsReached: function (ipAddress, url) {
      blacklist.addAddress(ipAddress);
    },
  })
);

// Limit Request
const limiter = rateLimit({
  windowMs: 1000 * 60,
  max: 5 * 6,
});
app.use(limiter);

app.post("/read", r_read);
app.use("/top", r_top);
app.post("/view", r_view);
app.post("/write", r_write);
app.use("/", r_index);

// Since it is filtered by nginx, the routing below should not be valid.
app.use(function (req, res, next) {
  res.status(404);
  res.type("txt").send("Not found");
});

module.exports = app;
