// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

var admin = require("firebase-admin");

var serviceAccount = require("../config/real-violet-app-firebase-adminsdk-qbg26-886db4cd69.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://real-violet-app.firebaseio.com"
});
