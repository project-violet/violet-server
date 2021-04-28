// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const a_database = require('../api/database');
const a_syncdatabase = require('../api/syncdatabase');

function _botLoop() {
  var conn = a_syncdatabase();
  var data =
      conn.query('SELECT Id, Etc FROM article ORDER BY Id DESC LIMIT 10');
  conn.finishAll();

  const pool = a_database();
  for (var i = 0; i < data.length; i++) {
    try {
      var id = data[i].Id;
      var etc = JSON.parse(data[i].Etc);

      // INSERT INTO article_article_junction (Article, Target) VALUES (~,~) ON
      // DUPLICATE KEY UPDATE Article=VALUES(Article), Target=VALUES(Target);
      /*
          article_article_junction
          article_eharticle_junction
          article_artist_junction
          article_group_junction
          article_character_junction
          article_series_junction
          article_tag_junction
      */

      if (!('Articles' in etc))
        pool.query(
            'INSERT INTO article_article_junction (Article, Target) VALUES ?' +
                ' ON DUPLICATE KEY UPDATE Article=VALUES(Article), Target=VALUES(Target)',
            [etc['Articles'].map(e => [id, e])],
            function(error, results, fields) {});
      if (!('EHArticles'))
        pool.query(
            'INSERT INTO article_eharticle_junction (Article, Target) VALUES ?' +
                ' ON DUPLICATE KEY UPDATE Article=VALUES(Article), Target=VALUES(Target)',
            [etc['EHArticles'].map(e => [id, e])],
            function(error, results, fields) {});
      if (!('Artists'))
        pool.query(
            'INSERT INTO article_artist_junction (Article, Target) VALUES ' +
                etc['Artists']
                    .map(
                        e => '(' + id +
                            ',(SELECT Id FROM eharticles_artists WHERE Name=?))')
                    .join(',') +
                ' ON DUPLICATE KEY UPDATE Article=VALUES(Article), Target=VALUES(Target)',
            etc['Artists'], function(error, results, fields) {});
      if (!('Groups'))
        pool.query(
            'INSERT INTO article_group_junction (Article, Target) VALUES ' +
                etc['Groups']
                    .map(
                        e => '(' + id +
                            ',(SELECT Id FROM eharticles_groups WHERE Name=?))')
                    .join(',') +
                ' ON DUPLICATE KEY UPDATE Article=VALUES(Article), Target=VALUES(Target)',
            etc['Groups'], function(error, results, fields) {});
      if (!('Series'))
        pool.query(
            'INSERT INTO article_series_junction (Article, Target) VALUES ' +
                etc['Series']
                    .map(
                        e => '(' + id +
                            ',(SELECT Id FROM eharticles_series WHERE Name=?))')
                    .join(',') +
                ' ON DUPLICATE KEY UPDATE Article=VALUES(Article), Target=VALUES(Target)',
            etc['Series'], function(error, results, fields) {});
      if (!('Characters'))
        pool.query(
            'INSERT INTO article_character_junction (Article, Target) VALUES ' +
                etc['Characters']
                    .map(
                        e => '(' + id +
                            ',(SELECT Id FROM eharticles_characters WHERE Name=?))')
                    .join(',') +
                ' ON DUPLICATE KEY UPDATE Article=VALUES(Article), Target=VALUES(Target)',
            etc['Characters'], function(error, results, fields) {});
      if (!('Tags'))
        pool.query(
            'INSERT INTO article_tag_junction (Article, Target) VALUES ' +
                etc['Tags']
                    .map(
                        e => '(' + id +
                            ',(SELECT Id FROM eharticles_tags WHERE Name=?))')
                    .join(',') +
                ' ON DUPLICATE KEY UPDATE Article=VALUES(Article), Target=VALUES(Target)',
            etc['Tags'], function(error, results, fields) {});
    } catch (e) {
    }
  }
}

// setInterval(_botLoop, 1000 * 10);