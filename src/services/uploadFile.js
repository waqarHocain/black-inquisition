const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const { STORAGE } = require("../config");

const client = new S3Client({
  region: "auto",
  endpoint: STORAGE.ENDPOINT,
  credentials: {
    accessKeyId: STORAGE.ACCESS_KEY,
    secretAccessKey: STORAGE.SECRET_ACCESS_KEY,
  },
});

const uploadFile = async (fileObj) => {
  const fileExt =
    fileObj.originalname.split(".")[fileObj.originalname.split(".").length - 1];
  const filename = fileObj.fieldname + Date.now() + "." + fileExt;

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: STORAGE.BUCKET,
        Key: filename,
        Body: fileObj.buffer,
        ContentType: fileObj.mimetype,
        ACL: "public-read",
      })
    );

    if (STORAGE.PUBLIC_URL.endsWith("/")) {
      return `${STORAGE.PUBLIC_URL}${STORAGE.BUCKET}/${filename}`;
    } else {
      return `${STORAGE.PUBLIC_URL}/${STORAGE.BUCKET}/${filename}`;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

module.exports = uploadFile;
