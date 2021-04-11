// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const express = require('express');
const router = express.Router();
const p = require('../../pages/status');

function p405(req, res, next) {
  res.status(405).type('html').send(p.p405);
}

const main = require('./main');
const detail = require('./detail');

router.get('/main', main);
router.post('/main', p405);
router.get('/detail', detail);
router.post('/detail', p405);

module.exports = router;