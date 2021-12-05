// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const config = require("config");
const logger = require("../../../etc/logger");
const r_auth = require("../../../auth/auth");
const aws_s3 = require("../../../api/aws-s3");

const bucket_name = config.get("upload.bookmark.bucket2");

// https://stackoverflow.com/questions/50366708/get-list-of-objects-located-under-a-specific-s3-folder/69754448#69754448
// https://stackoverflow.com/questions/18512492/does-amazon-s3-have-a-limit-to-maxkeys-when-calling-listobjects/18513468
function getListingS3() {
  return new Promise((resolve, reject) => {
    try {
      let params = {
        Bucket: bucket_name,
        MaxKeys: 1000,
      };

      const allKeys = [];

      listAllKeys();

      function listAllKeys() {
        aws_s3.listObjectsV2(params, function (err, data) {
          if (err) {
            reject(err);
          } else {
            var contents = data.Contents;
            contents.forEach(function (content) {
              allKeys.push(content);
            });

            if (data.IsTruncated) {
              params.ContinuationToken = data.NextContinuationToken;
              console.log("get further list...");
              listAllKeys();
            } else {
              resolve(allKeys);
            }
          }
        });
      }
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = async function bookmarks(req, res, next) {
  if (!r_auth.auth(req)) {
    res.status(403).type("json").send({ msg: "forbidden" });
    return;
  }

  var result = await getListingS3();

  result.sort((a, b) => b.Size - a.Size);
  result = result.splice(0, 500);

  res
    .status(200)
    .type("json")
    .send({
      msg: "success",
      result: result.map((x) => {
        return { size: x.Size, user: x.Key.split("-")[1] };
      }),
    });
};
