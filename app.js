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

const m_view = require("./memory/view");

const r_index = require("./routes/index");
const r_read = require("./routes/read");
const r_top = require("./routes/top");
const r_view = require("./routes/view");
const r_write = require("./routes/write");
var p = require("./pages/status");

const app = express();

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

app.use("/read", r_read);
app.use("/top", r_top);
app.post("/view", r_view);
app.get("/view", function (req, res, next) { res.status(405).type("html").send(p.p405); });
app.use("/write", r_write);
app.get('/', function (req, res) {
  res.redirect('/api-docs');
});

// Since it is filtered by nginx, the routing below should not be valid.
app.use(function (req, res, next) {
  res.status(404).type("html").send(p.p404);
});

module.exports = app;
