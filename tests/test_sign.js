// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const s_up = require('../routes/community/sign/up');
const s_in = require('../routes/community/sign/in');

const testAuth = require('./test_auth');

async function test_sign_up() {
  var auth = testAuth();

  await s_up(
      {
        headers: auth,
        body: {
          Id: 'test',
          Password: 'testtest',
          UserAppId: 'no',
          NickName: 'test',
          Etc: 'test'
        }
      },
      null, null);
}

async function test_sign_in() {
  var auth = testAuth();

  await s_in(
      {
        headers: auth,
        body: {
            Id: 'test',
            Password: 'testtest',
        }
      },
      null, null);
}

// test_sign_up().then();
test_sign_in().then();