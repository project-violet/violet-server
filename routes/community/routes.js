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
const a_delete = require('./article/delete');

router.get('/article/read', a_read);
router.post('/article/write', a_write);
router.post('/article/edit', a_edit);
router.post('/article/vote', a_vote);
router.post('/article/delete', a_delete);
router.post('/article/read', p405);
router.get('/article/write', p405);
router.get('/article/edit', p405);
router.get('/article/vote', p405);
router.get('/article/delete', p405);

const b_list = require('./board/list');
const b_page = require('./board/page');

router.get('/board/list', b_list);
router.get('/board/page', b_page);
router.post('/board/list', p405);
router.post('/board/page', p405);

const c_read = require('./comment/read');
const c_write = require('./comment/write');

router.get('/comment/read', c_read);
router.post('/comment/wrtie', c_write);
router.post('/comment/read', p405);
router.get('/comment/write', p405);

const p_enroll = require('./push/enroll');
const p_leave = require('./push/leave');
const p_lookup = require('./push/lookup');

router.post('/push/enroll', p_enroll);
router.post('/push/leave', p_leave);
router.post('/push/lookup', p_lookup);
router.get('/push/enroll', p405);
router.get('/push/leave', p405);
router.get('/push/lookup', p405);

const s_in = require('./sign/in');
const s_up = require('./sign/up');
const s_util = require('./sign/util');

router.post('/sign/in', s_in);
router.post('/sign/up', s_up);
router.use('/sign/util', s_util);
router.get('/sign/in', p405);
router.get('/sign/up', p405);

const u_info = require('./user/info');

router.get('/user/info', u_info);
router.post('/user/info', p405);

const eh = require('./eh/routes');

router.use('/eh', eh);

const anon = require('./anon/routes');

router.use('/anon', anon);

module.exports = router;