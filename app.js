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
const error = require('http-errors');

const r_api = require('./routes/api');

const app = express();

app.use('/api', r_api);
app.use(function(req, res, next) {
  error(404);
});

module.exports = app;