// This source code is a part of Project Violet.
// Copyright (C) 2020. violet-team. Licensed under the Apache-2.0 License.

var express = require("express");
var router = express.Router();

var r_auth = require('../auth/auth');

// Read a post on the main board.
router.get("/main", main);
async function main(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type('json').send({'msg':'forbidden'});
    return; 
  }
}

module.exports = router;