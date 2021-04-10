// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const express = require('express');
const router = express.Router();
const p = require('../../pages/status');

function p405(req, res, next) {
  res.status(405).type('html').send(p.p405);
}

const main = require('./main');

router.post('/main', main);
router.get('/main', p405);

module.exports = router;