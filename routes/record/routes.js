// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const express = require('express');
const router = express.Router();
const p = require('../../pages/status');

function p405(req, res, next) {
  res.status(405).type('html').send(p.p405);
}

const a_recent = require('./recent');
const a_recent_u = require('./recent_u');
const a_user_recent = require('./user_recent');

router.get('/recent', a_recent);
router.post('/recent', p405);
router.get('/recent_u', a_recent_u);
router.post('/recent_u', p405);
router.get('/user_recent', a_user_recent);
router.post('/user_recent', p405);

module.exports = router;