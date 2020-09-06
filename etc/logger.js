// This source code is a part of Project Violet.
// Copyright (C) 2020. violet-team. Licensed under the Apache-2.0 License.

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, json, splat, prettyPrint } = format;

require("winston-daily-rotate-file");

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} - ${level}: ${JSON.stringify(message, null, 2)}`;
});

var transport = new transports.DailyRotateFile({
  filename: "./log/%DATE%.log",
  datePattern: "YYYY-MM-DD",
});

var logger = createLogger({
  format: combine(
    timestamp(),
    json(),
    splat(),
    prettyPrint(),
    myFormat,
  ),
  transports: [transport],
});

module.exports = logger;