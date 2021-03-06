//===----------------------------------------------------------------------===//
//
//                            Violet API Server
//
//===----------------------------------------------------------------------===//
//
//  Copyright (C) 2020-2021. violet-team. All Rights Reserved.
//
//===----------------------------------------------------------------------===//

const express = require('express');
const createError = require('http-errors');
const expressDefend = require('express-defend');
const blacklist = require('express-blacklist');
const rateLimit = require('express-rate-limit');

const r_community = require('./routes/community/routes');
const r_search = require('./routes/search/routes');
const r_index = require('./routes/index');
const r_query = require('./routes/query');
const r_top = require('./routes/top');
const r_upload = require('./routes/upload');
const r_view = require('./routes/view');
const r_view_close = require('./routes/view_close');
const r_view_report = require('./routes/view_report');

// const t_1144 = require('./routes/test1144');
// const t_1145 = require('./routes/test1145');

const p = require('./pages/status');

const app = express();

const bots = require('./bot/bots');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.disable('x-powered-by');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

// Ban ip address
app.use(blacklist.blockRequests('blacklist.txt'));
app.use(expressDefend.protect({
  maxAttempts: 1,
  dropSuspiciousRequest: true,
  onMaxAttemptsReached: function(ipAddress, url) {
    blacklist.addAddress(ipAddress);
  },
}));
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({limit: '5mb', extended: false}));


// Limit Request
const limiter = rateLimit({
  windowMs: 1000 * 60,
  max: 5 * 6 * 3 * 100,
});
app.use(limiter);

app.use('/community', r_community);
app.use('/search', r_search);
app.use('/query', r_query);
app.use('/top', r_top);
app.post('/upload', r_upload);
app.post('/view', r_view);
app.get('/view', function(req, res, next) {
  res.status(405).type('html').send(p.p405);
});
app.post('/view_close', r_view_close);
app.get('/view_close', function(req, res, next) {
  res.status(405).type('html').send(p.p405);
});
app.post('/view_report', r_view_report);
app.get('/view_report', function(req, res, next) {
  res.status(405).type('html').send(p.p405);
});

// app.use('/1144', t_1144);

app.get('/', function(req, res) {
  res.redirect('/api-docs');
});

// Since it is filtered by nginx, the routing below should not be valid.
app.use(function(req, res, next) {
  res.status(404).type('html').send(p.p404);
});

module.exports = app;
