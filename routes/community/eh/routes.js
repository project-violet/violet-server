// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const express = require('express');
const router = express.Router();
const p = require('../../../pages/status');

function p405(req, res, next) {
  res.status(405).type('html').send(p.p405);
}

const a_read = require('./article/read');

router.get('/article/read', a_read);
router.post('/article/read', p405);

const c_read = require('./comment/read');
const c_write = require('./comment/write');

router.get('/comment/read', c_read);
router.post('/comment/write', c_write);
router.get('/comment/write', p405);
router.post('/comment/read', p405);

module.exports = router;