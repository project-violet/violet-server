//===----------------------------------------------------------------------===//
//
//                            Violet API Server
//
//===----------------------------------------------------------------------===//
//
//  Copyright (C) 2020. violet-team. All Rights Reserved.
//
//===----------------------------------------------------------------------===//

const express = require('express');
const createError = require('http-errors');
const expressDefend = require('express-defend');
const blacklist = require('express-blacklist');
const rateLimit = require("express-rate-limit");

const r_api = require('./routes/api');

const app = express();

// Ban ip address.
app.use(blacklist.blockRequests('blacklist.txt'));
app.use(expressDefend.protect({ 
    maxAttempts: 5,
    dropSuspiciousRequest: true,
    logFile: 'suspicious.log',
    onMaxAttemptsReached: function(ipAddress, url){
      blacklist.addAddress(ipAddress);
    } 
}));

// Limit Request
const limiter = rateLimit({
  windowMs: 10000,
  max: 10,
  message:
    "Too many accounts created from this IP, please try again after an hour"
});
app.use(limiter);

app.use('/', r_api);

// Since it is filtered by nginx, the routing below should not be valid.
app.use(function (req, res, next) {
  res.status(404);
  res.type('txt').send('Not found');
});

module.exports = app;