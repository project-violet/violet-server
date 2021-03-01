// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const a_database = require('../api/database');
const a_syncdatabase = require('../api/syncdatabase');

const logger = require('../etc/logger');

var CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };

module.exports = {
  append: function(no, userid, seconds) {
    try {
      logger.info('view-close-append %d %s %s', no, userid, seconds);
    } catch (e) {
      logger.error('view-close-append');
      logger.error(e);
      console.log(e);
    }

    var pool = a_database();
    pool.query(
        'INSERT INTO viewtime SET ?', {
          ArticleId: no,
          TimeStamp: CURRENT_TIMESTAMP,
          ViewSeconds: seconds,
          UserAppId: userid,
        },
        function(error, results, fields) {
          if (error != null) {
            logger.error('viewdb', error);
          }
        });
  },
};
