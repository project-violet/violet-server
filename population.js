//===----------------------------------------------------------------------===//
//
//                   Violet API Server Population Eggreator
//
//===----------------------------------------------------------------------===//
//
//  Copyright (C) 2021. violet-team. All Rights Reserved.
//
//===----------------------------------------------------------------------===//

const a_syncdatabase = require("./api/syncdatabase");

const path = require("path");
const fs = require("fs");

async function _cachePopulationSource() {
  const conn = a_syncdatabase();

  for (var i = 0; i < 30; i++) {
    const data = conn.query(
      `SELECT ArticleId FROM viewtime WHERE ViewSeconds>=24 
          order by Id limit 1000000 offset ` + (i * 1000000).toString()
    );
    const dataPath = path.resolve(
      __dirname,
      "population-src-" + i.toString() + ".json"
    );

    console.log(data.length);
    console.log(data[0]);

    fs.writeFileSync(
      dataPath,
      JSON.stringify(data.map((x) => x["ArticleId"])),
      function (err) {
        console.log(err);
        process.exit();
      }
    );
  }
}

// _cachePopulationSource();

async function _buildPopulation() {
  var rr = {};

  for (var i = 0; i < 30; i++) {
    const dataPath = path.resolve(
      __dirname,
      "population-src-" + i.toString() + ".json"
    );
    var j = JSON.parse(fs.readFileSync(dataPath));

    for (var x of j) {
      if (x in rr) rr[x] += 1;
      else rr[x] = 1;
    }

    console.log(j.length);
  }

  var items = Object.keys(rr).map(function(key) {
    return [key, rr[key]];
  });
  
  // Sort the array based on the second element
  items.sort(function(first, second) {
    return second[1] - first[1];
  });

  const dataPath2 = path.resolve(
    __dirname,
    "population.json"
  );

  fs.writeFileSync(
    dataPath2,
    JSON.stringify(items.map((x) => parseInt(x[0]))),
    function (err) {
      console.log(err);
      process.exit();
    }
  );
}

_buildPopulation();
