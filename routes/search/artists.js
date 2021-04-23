// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

// artist:, group:, series:, character:, tag:

const Joi = require('joi');

const a_database = require('../../api/database');
const logger = require('../../etc/logger');
const m_search = require('../../memory/search');

const artistsSchema = Joi.object({
  Artists: Joi.array().items(Joi.string()),
  Groups: Joi.array().items(Joi.string()),
  Series: Joi.array().items(Joi.string()),
  Characters: Joi.array().items(Joi.string()),
  Tags: Joi.array().items(Joi.string()),
  Language: Joi.array().min(1).items(Joi.string()).required(),
});

/*
select a.Article, 'michiking' as Artist from (eharticles_artists_junction as a
left join eharticles as b on a.Article=b.Id) where a.Artist=( select Id from
eharticles_artists where Name='michiking' ) and (b.Language='korean' or
b.Language='n/a') order by Article desc limit 1
*/

function _artists(res, query) {
  var sql_union = [];
  var values = [];
  if ('Artists' in query) {
    query.Artists.forEach(
        e => sql_union.push(
            '(select a.Article, ? as Artist from (eharticles_artists_junction  as a left join eharticles as b on a.Article=b.Id) where a.Artist=(' +
            'select Id from eharticles_artists where Name=?' +
            ') and (' + query.Language.map(e => 'b.Language=?').join(' or ') +
            ') order by Article desc limit 1)'));
    query.Artists.forEach(e => {
      values.push('artist:' + e);
      values.push(e);
      query.Language.forEach(e => values.push(e));
    });
  }
  if ('Groups' in query) {
    query.Groups.forEach(
        e => sql_union.push(
            '(select a.Article, ? as Artist from (eharticles_groups_junction  as a left join eharticles as b on a.Article=b.Id) where a.Group=(' +
            'select Id from eharticles_groups where Name=?' +
            ') and (' + query.Language.map(e => 'b.Language=?').join(' or ') +
            ') order by Article desc limit 1)'));
    query.Groups.forEach(e => {
      values.push('group:' + e);
      values.push(e);
      query.Language.forEach(e => values.push(e));
    });
  }
  if ('Series' in query) {
    query.Series.forEach(
        e => sql_union.push(
            '(select a.Article, ? as Artist from (eharticles_series_junction as a left join eharticles as b on a.Article=b.Id) where a.Series=(' +
            'select Id from eharticles_series where Name=?' +
            ') and (' + query.Language.map(e => 'b.Language=?').join(' or ') +
            ') order by Article desc limit 1)'));
    query.Series.forEach(e => {
      values.push('series' + e);
      values.push(e);
      query.Language.forEach(e => values.push(e));
    });
  }
  if ('Characters' in query) {
    query.Characters.forEach(
        e => sql_union.push(
            '(select a.Article, ? as Artist from (eharticles_characters_junction  as a left join eharticles as b on a.Article=b.Id) where a.Character=(' +
            'select Id from eharticles_characters where Name=?' +
            ') and (' + query.Language.map(e => 'b.Language=?').join(' or ') +
            ') order by Article desc limit 1)'));
    query.Characters.forEach(e => {
      values.push('character:' + e);
      values.push(e);
      query.Language.forEach(e => values.push(e));
    });
  }
  if ('Tags' in query) {
    query.Tags.forEach(
        e => sql_union.push(
            '(select a.Article, ? as Artist from (eharticles_tags_junction  as a left join eharticles as b on a.Article=b.Id) where a.Tag=(' +
            'select Id from eharticles_tags where Name=?' +
            ') and (' + query.Language.map(e => 'b.Language=?').join(' or ') +
            ') order by Article desc limit 1)'));
    query.Tags.forEach(e => {
      values.push('tag:' + e);
      values.push(e);
      query.Language.forEach(e => values.push(e));
    });
  }

  const pool = a_database();
  const qr = pool.query(
      'select t.Artist from (' + sql_union.join(' union ') +
          ') as t order by t.Article desc',
      values, function(error, results, fields) {
        if (error != null) {
          logger.error('search-artists');
          logger.error(error);
          res.status(500).type('json').send({msg: 'internal server error'});
        } else {
          res.status(200).type('json').send({msg: 'success', result: results.map(e => e.Artist)});
        }
      });
}

// Get first articles of artists(artist, group, series, character, tag)
module.exports = async function(req, res, next) {
  try {
    await artistsSchema.validateAsync(req.body);

    _artists(res, req.body);
  } catch (e) {
    console.log(e);
    res.status(400).type('json').send({msg: 'bad request'});
  }
}