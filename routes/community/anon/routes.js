// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const express = require('express');
const router = express.Router();
const p = require('../../../pages/status');

function p405(req, res, next) {
  res.status(405).type('html').send(p.p405);
}

const a_read = require('./artistcomment/read');
const a_write = require('./artistcomment/write');

router.get('/article/read', a_read);
router.post('/article/read', p405);
router.post('/article/write', a_write);
router.get('/article/write', p405);