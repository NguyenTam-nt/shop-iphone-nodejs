const cloudinary = require("../configs/cloudinary.config")
const {
  PutObjectCommand,
  s3,
  GetObjectCommand,
} = require("../configs/s3.config")
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer")
const crypto = require("crypto")

const urlImagePublic = "https://d8s3w2x3993wu.cloudfront.net"

const randomImageName = () => {
  return crypto.randomBytes(16).toString("hex")
}

class UploadService {
  // S3 AWS third party service

  static async uploadS3Image({ file }) {
    try {
      const nameFile = randomImageName()
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: nameFile, //file.originalname || "unknown",
        Body: file.buffer,
        ContentType: "image/jpeg",
      })

      const result = await s3.send(command)
      // const signalUrl = new GetObjectCommand({
      //   Bucket: process.env.AWS_BUCKET_NAME,
      //   Key: nameFile,
      // })
      // const url = await getSignedUrl(s3, signalUrl, { expiresIn: 3600 })

      const signedUrl = getSignedUrl({
        url: `${urlImagePublic}/${nameFile}`,
        keyPairId: "K1PF1NZOMYXX04",
        dateLessThan: new Date(Date.now() + 1000 * 60),
        privateKey: process.env.AWS_PRIVATE_KEY,
      })

      return {
        secure_url: signedUrl,
      }
    } catch (error) {}
  }

  // cloudinary third party service
  static async updateImage({ path }) {
    try {
      const uploadResult = await cloudinary.uploader.upload(path, {
        public_id: Date.now() + "",
        folder: `product/productId`,
      })
      console.log(uploadResult)
      return {
        secure_url: uploadResult.secure_url,
      }
    } catch (error) {
      console.log({ error })
    }
  }
}

module.exports = UploadService
