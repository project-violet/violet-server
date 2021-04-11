// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const admin = require("firebase-admin");

const serviceAccount = require("../config/real-violet-app-firebase-adminsdk-qbg26-886db4cd69.json");

const logger = require('../../../etc/logger');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  //   databaseURL: "https://real-violet-app.firebaseio.com"
});

module.exports = {
  sendToken: async function (token, title, body, style, click_action) {
    admin.messaging().send({
      token: token,
      notification: {
        title: title,
        body: body,
        click_action: click_action,
      },
      style: style,
    }).then((response) => {
      logger.info('send-token', response);
    }).catch((error) => {
      logger.error('send-token', error);
    });
  },

  sendTopic: async function (topic, title, body, style, click_action) {

  }
};