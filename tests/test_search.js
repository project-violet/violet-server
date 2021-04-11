// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const s_main = require('../routes/search/main');
const testAuth = require('./test_auth');

async function test_search() {
  var auth = testAuth();

  await s_main({headers: auth, body: {
      Session: '9921be4e1cfa5bab38e6726e2489af7590539760302e942821fcf8e5a6f598edad2eb0b47eec642e04c10ef19e530530514b3c6619be5d2934fbe736b7e5b14d',
      Offset: 0,
      Search: 'lang:korean',
  }}, null, null);
}

test_search().then();