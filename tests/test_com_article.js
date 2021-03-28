// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const a_write = require('../routes/community/article/write');
const a_edit = require('../routes/community/article/edit');
const a_vote = require('../routes/community/article/vote');
const testAuth = require('./test_auth');

async function test_com_article_write() {
  var auth = testAuth();

  await a_write({headers: auth, body: {
      Session: 'a1b9180a193f6ae95d83c5577fbdd2b03c712d5a0ccf17ab43ae312930824812ddcc7128334c1021a5e60c72f690b598ea08b4df0b3195aa79fc005b61710aec',
      Board: 1,
      Title: '원자론과의 만남',
      Body: `1920년 봄이었던 것으로 생각된다. 1차 세계대전의 종결은 독일 청년들을 불안과 동요의 상태로 몰아넣는 결과를 가져왔다. 크게 실망한앞선 세대들의 손에서 고삐는 빠져나갔고, 따라서 젊은이들은 자기 자신들이 새롭게 나아갈 길을 찾기 위해, 또는 이미 부서진것처럼 보이는 낡은 나침반 대신 사람들이 표준으로 삼을 수 있는 새로운 나침반을 발견하기 위하여, 크고 작은 여러 종류의 단체와그룹으로 모이기 시작하였다.`,
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

async function test_com_article_vote() {
  var auth = testAuth();
  
  await a_vote({headers: auth, body: {
    Article: 5,
    Session: 'a1b9180a193f6ae95d83c5577fbdd2b03c712d5a0ccf17ab43ae312930824812ddcc7128334c1021a5e60c72f690b598ea08b4df0b3195aa79fc005b61710aec',
    Status: 0,
  }}, null, null);
}

test_com_article_write().then();
// test_com_article_vote().then();