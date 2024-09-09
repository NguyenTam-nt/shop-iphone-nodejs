"use strict"

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3")

const s3Config = {
  region: "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
}

module.exports = {
  s3: new S3Client(s3Config),
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
}
