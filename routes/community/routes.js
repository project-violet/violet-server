// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const express = require('express');
const router = express.Router();
const p = require('../../pages/status');

function p405(req, res, next) {
  res.status(405).type('html').send(p.p405);
}

const a_read = require('./article/read');
const a_write = require('./article/write');
const a_edit = require('./article/edit');
const a_vote = require('./article/vote');

router.get('/article/read', a_read);
router.post('/article/write', a_write);
router.post('/article/edit', a_edit);
router.post('/article/vote', a_vote);
router.post('/article/read', p405);
router.get('/article/write', p405);
router.get('/article/edit', p405);
router.get('/article/vote', p405);

const b_list = require('./board/list');
const b_page = require('./board/page');

router.get('/board/list', b_list);
router.get('/board/page', b_page);
router.post('/board/list', p405);
router.post('/board/page', p405);

const s_in = require('./sign/in');
const s_up = require('./sign/up');
const s_util = require('./sign/util');

router.post('/sign/in', s_in);
router.post('/sign/up', s_up);
router.use('/sign/util', s_util);
router.get('/sign/in', p405);
router.get('/sign/up', p405);

module.exports = router;