//===----------------------------------------------------------------------===//
//
//                   Violet API Server Population Eggreator
//
//===----------------------------------------------------------------------===//
//
//  Copyright (C) 2021. violet-team. All Rights Reserved.
//
//===----------------------------------------------------------------------===//

const a_syncdatabase = require('./api/syncdatabase');

const path = require('path');
const fs = require('fs');

async function _buildPopulation() {
  const conn = a_syncdatabase();
  const data = conn.query(
      `select ArticleId, count(*) as C from viewtotal 
      group by ArticleId order by C desc`);
  const dataPath = path.resolve(
      __dirname, 'population.json');

  console.log(data.length);

  fs.writeFile(dataPath, JSON.stringify(data.map(x => x['ArticleId'])), function(err) {
    console.log(err);
  });
}

_buildPopulation();