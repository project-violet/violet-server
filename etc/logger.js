// This source code is a part of Project Violet.
// Copyright (C) 2020. violet-team. Licensed under the Apache-2.0 License.

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

require("winston-daily-rotate-file");

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${level}] ${message}`;
});

var transport = new transports.DailyRotateFile({
  filename: "./log/%DATE%.log",
  datePattern: "YYYY-MM-DD",
});

var logger = createLogger({
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [transport],
});

module.exports = logger;