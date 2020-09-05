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

const r_api = require('./routes/api');

const app = express();

app.use('/api', r_api);

// Since it is filtered by nginx, the routing below should not be valid.
app.use(function (req, res, next) {
  res.status(404);
  
  res.type('txt').send('Not found');
});

module.exports = app;