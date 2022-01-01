// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const express = require('express');
const router = express.Router();
const p = require('../../pages/status');

function p405(req, res, next) {
  res.status(405).type('html').send(p.p405);
}

// const a_bookmarks = require('./bookmarks');
// const a_restore = require('./restore');
// const a_restore_v = require('./restore_v');
// const a_versions = require('./versions');
// const a_upload = require('./upload');

// router.get('/bookmarks', a_bookmarks);
// router.get('/restore', a_restore);
// router.get('/restore_v', a_restore_v);
// router.get('/versions', a_versions);
// router.post('/upload', a_upload);

// router.post('/bookmarks', p405);
// router.post('/restore', p405);
// router.post('/restore_v', p405);
// router.post('/versions', p405);
// router.get('/upload', p405);

const v2 = require('./v2/routes');

router.use('/v2', v2);

module.exports = router;