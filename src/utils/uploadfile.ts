import { S3 } from "aws-sdk";

export const s3 = new S3({
  region: "us-west-1",
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  signatureVersion: "v4",
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "2mb",
    },
  },
};

const getUploadPromise = async (name: string, type: string) => {
  try {
    const fileParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: name,
      Expires: 600,
      ContentType: type,
    };
    const url = await s3.getSignedUrlPromise("putObject", fileParams);
    return url;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export default getUploadPromise;
