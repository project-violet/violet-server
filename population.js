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
      'select Id from viewtime where ViewSeconds >= 24 group by Id order by ViewSeconds desc');
  const dataPath = path.resolve(
      __dirname, 'population.json');

  console.log(data.length);

  fs.writeFile(dataPath, JSON.stringify(data.map(x => x['Id'])), function(err) {
    console.log(err);
  });
}

_buildPopulation();