// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const express = require('express');
const router = express.Router();
const p = require('../../pages/status');

function p405(req, res, next) {
  res.status(405).type('html').send(p.p405);
}

const e_find = require('./find');
const e_author = require('./author');

router.get('/find', e_find);
router.post('/find', p405);
router.get('/author', e_author);
router.post('/author', p405);

module.exports = router;