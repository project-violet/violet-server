// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const a_database = require('../api/database');

async function test_eharticles() {
  const pool = a_database();
  const qr = pool.query(
      'SELECT * FROM eharticles WHERE Language="korean" ORDER BY Id DESC LIMIT 10',
      function(error, results, fields) {
          console.log(results);
      });
}

test_eharticles().then();