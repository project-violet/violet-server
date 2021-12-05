// This source code is a part of Project Violet.
// Copyright (C) 2021. violet-team. Licensed under the Apache-2.0 License.

const config = require("config");
const aws_s3 = require("./api/aws-s3");

const bucket_name_v1 = config.get("upload.bookmark.bucket");
const bucket_name_v2 = config.get("upload.bookmark.bucket2");

// https://stackoverflow.com/questions/50366708/get-list-of-objects-located-under-a-specific-s3-folder/69754448#69754448
// https://stackoverflow.com/questions/18512492/does-amazon-s3-have-a-limit-to-maxkeys-when-calling-listobjects/18513468
function getListingS3(bucket_name) {
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

getListingS3(bucket_name_v1).then(async function (v) {
  var i = 0;
  for (var x of v) {
    i++;
    console.log(i.toString() + "/" + v.length.toString());
    var param = {
      Bucket: bucket_name_v1,
      Key: x.Key,
    };

    var r = await aws_s3.getObject(param).promise();
    console.log("get " + x.Key);

    var param2 = {
      Bucket: bucket_name_v2,
      Key: x.Key,
      ACL: "public-read",
      Body: r.Body.toString(),
      ContentType: "text/json",
    };

    await aws_s3.upload(param2).promise();
    console.log("upload " + x.Key);
  }
});
