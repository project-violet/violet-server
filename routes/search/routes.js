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
const ehash = require('./ehash');
const hybrid = require('./hybrid');
const artists = require('./artists');
const counts = require('./counts');
const msg = require('./msg');

router.get('/main', main);
router.post('/main', p405);
router.get('/detail', detail);
router.post('/detail', p405);
router.get('/ehash', ehash);
router.post('/ehash', p405);
router.get('/hybrid', hybrid);
router.post('/hybrid', p405);
router.post('/artists', artists);
router.get('/artists', p405);
router.get('/counts', counts);
router.post('/counts', p405);
router.get('/msg/*', msg);
router.post('/msg', p405);

module.exports = router;