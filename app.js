//===----------------------------------------------------------------------===//
//
//                            Violet API Server
//
//===----------------------------------------------------------------------===//
//
//  Copyright (C) 2020-2021. violet-team. All Rights Reserved.
//
//===----------------------------------------------------------------------===//

const config = require("config");
const AWS = require("aws-sdk");
AWS.config.loadFromPath(__dirname + "/./config/s3.json");

const express = require("express");
const createError = require("http-errors");
const expressDefend = require("express-defend");
const blacklist = require("express-blacklist");
const rateLimit = require("express-rate-limit");

const r_cur_ts = require("./routes/cur_ts");
const r_community = require("./routes/community/routes");
const r_backup = require("./routes/backup/upload");
const r_excomment = require("./routes/excomment/routes");
const r_search = require("./routes/search/routes");
const r_record = require("./routes/record/routes");
const r_index = require("./routes/index");
const r_query = require("./routes/query");
const r_top = require("./routes/top");
const r_top_ts = require("./routes/top_ts");
const r_top_recent = require("./routes/top_recent");
const r_upload = require("./routes/upload");
const r_restore = require("./routes/restore");
const r_bookmarks = require("./routes/bookmarks/routes");
const r_view = require("./routes/view");
const r_view_close = require("./routes/view_close");
const r_view_report = require("./routes/view_report");

// const t_1144 = require('./routes/test1144');
// const t_1145 = require('./routes/test1145');

const p = require("./pages/status");

const app = express();

const bots = require("./bot/bots");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

app.disable("x-powered-by");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));

// Ban ip address
app.use(blacklist.blockRequests("blacklist.txt"));
app.use(
  expressDefend.protect({
    maxAttempts: 1,
    dropSuspiciousRequest: true,
    onMaxAttemptsReached: function (ipAddress, url) {
      blacklist.addAddress(ipAddress);
    },
  })
);
// Limit Request
const limiter = rateLimit({
  windowMs: 1000 * 60,
  max: 5 * 6 * 3 * 100,
});
app.use(limiter);

app.use("/cur_ts", r_cur_ts);
app.use("/community", r_community);
// app.use("/fupload", r_backup);
app.use("/excomment", r_excomment);
app.use("/search", r_search);
app.use("/query", r_query);
app.use("/top", r_top);
app.use("/top_ts", r_top_ts);
app.use("/top_recent", r_top_recent);
app.use("/record", r_record);
app.post("/upload", r_upload);
app.get("/restore", r_restore);
// app.get('/bookmarks2', r_bookmarks);
app.use("/bookmarks", r_bookmarks);
app.post("/view", r_view);
app.get("/view", function (req, res, next) {
  res.status(405).type("html").send(p.p405);
});
app.post("/view_close", r_view_close);
app.get("/view_close", function (req, res, next) {
  res.status(405).type("html").send(p.p405);
});
app.post("/view_report", r_view_report);
app.get("/view_report", function (req, res, next) {
  res.status(405).type("html").send(p.p405);
});

// app.use('/1144', t_1144);

// const r_auth = require("./auth/auth");
const { S3Client } = require("@aws-sdk/client-s3");
const aws_s3_new = require("./api/aws-s3-new");
const s3 = new AWS.S3();
const multer = require("multer");
const multerS3 = require("multer-s3");
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "violet-user-data-backup",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `${Date.now().toString()}_${file.originalname}`);
    },
    acl: "public-read",
  }),
});

app.post("/fupload", upload.single("file"), function (req, res, next) {
  console.log(req.file);
  res.send();
});

app.get("/", function (req, res) {
  res.redirect("/api-docs");
});

// Since it is filtered by nginx, the routing below should not be valid.
app.use(function (req, res, next) {
  res.status(404).type("html").send(p.p404);
});

module.exports = app;
