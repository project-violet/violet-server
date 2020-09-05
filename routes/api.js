// This source code is a part of Project Violet.
// Copyright (C) 2020. violet-team. Licensed under the Apache-2.0 License.

var express = require('express');
var router = express.Router();

var r_auth = require('../auth/auth');

router.get('/', empty);
function empty(req, res, next) {
  res.type('json').send({'msg':'hello violet api server!'});
}

router.get('/authtest', auth);
function auth(req, res, next) {
  res.type('json').send({'msg':'msg'});
}

router.use(function (req, res, next) {
  res.status(501);
  res.type('json').send({'msg':'wrong request?'});
});

module.exports = router;