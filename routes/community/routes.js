// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const express = require('express');
const router = express.Router();

const a_read = require('./article/read');
const a_write = require('./article/write');

router.get('/article/read', a_read);
router.post('/article/write', a_write);

const b_list = require('./board/list');
const b_page = require('./board/page');

router.get('/board/list', b_list);
router.get('/board/page', b_page);

const s_in = require('./sign/in');
const s_up = require('./sign/up');
const s_util = require('./sign/util');

router.post('/sign/in', s_in);
router.post('/sign/up', s_up);
router.use('/sign/util', s_util);

module.exports = router;