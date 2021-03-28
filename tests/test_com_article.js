// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const a_write = require('../routes/community/article/write');
const a_edit = require('../routes/community/article/edit');
const testAuth = require('./test_auth');

async function test_com_article_write() {
  var auth = testAuth();

  await a_write({headers: auth, body: {
      Session: 'a1b9180a193f6ae95d83c5577fbdd2b03c712d5a0ccf17ab43ae312930824812ddcc7128334c1021a5e60c72f690b598ea08b4df0b3195aa79fc005b61710aec',
      Board: 1,
      Title: '테스트 중',
      Body: '테스트테스트',
      Etc: '{xx:yy}',
  }}, null, null);
}


async function test_com_article_edit() {
  var auth = testAuth();

  await a_edit({headers: auth, body: {
      Id: 5,
      Session: 'a1b9180a193f6ae95d83c5577fbdd2b03c712d5a0ccf17ab43ae312930824812ddcc7128334c1021a5e60c72f690b598ea08b4df0b3195aa79fc005b61710aec',
      Board: 1,
      Title: '테스트 중 (수정본)',
      Body: '테스트테스트',
      Etc: '{xx:yy}',
  }}, null, null);
}

test_com_article_edit().then();