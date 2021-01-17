// This source code is a part of Project Violet.
// Copyright (C) 2020-2021. violet-team. Licensed under the Apache-2.0 License.

const r_auth = require("../auth/auth");
const m_view = require("../memory/view");

// This function is triggered when the user reads a specific article.
module.exports = async function view(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type("json").send({ msg: "forbidden" });
    return;
  }

  if (req.body["no"] == null || req.body["user"] == null) {
    res.status(400).type("json").send({ msg: "bad request" });
    return;
  }

  const no = parseInt(req.body["no"]);

  if (isNaN(no)) {
    res.status(400).type("json").send({ msg: "bad request" });
    return;
  }

  m_view.append(no, req.body["user"]);
  res.status(200).type("json").send({ msg: "success" });
};
