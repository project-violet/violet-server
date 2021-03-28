// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const b_page = require('../routes/community/board/page');
const testAuth = require('./test_auth');

async function test_com_page() {
  var auth = testAuth();

  await b_page({headers: auth, query: {
      board: 1,
      p: 0,
  }}, null, null);
}

test_com_page().then();