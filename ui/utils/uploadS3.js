import { S3 } from '@aws-sdk/client-s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: 'https://fra1.digitaloceanspaces.com',
  region: 'fra1',
  credentials: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET
  }
});

// Uploads the specified file to the chosen path.
export const uploadToS3 = async (fileName, audioFile) => {
  const bucketParams = {
    Bucket: process.env.SPACES_BUCKET,
    Key: `sample/${fileName}.webm`,
    Body: audioFile
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(bucketParams));
    console.log(`Successfully uploaded object: ${bucketParams.Key}`);
    return data;
  } catch (err) {
    console.log('We have an error: ', err);
  }
};
