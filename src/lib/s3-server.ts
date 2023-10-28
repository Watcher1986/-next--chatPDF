import fs from 'fs';
import { initS3 } from './s3';

export async function downloadFromS3(file_key: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const s3 = initS3();
      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
      };

      const obj = await s3.getObject(params);

      const file_name = `/tmp/${file_key.split('uploads/')[1]}`;
      if (!fs.existsSync('/tmp')) fs.mkdirSync('/tmp');
      if (fs.existsSync(file_name)) fs.unlinkSync(file_name);

      // fs.writeFileSync(file_name, obj.Body as Buffer);

      if (obj.Body instanceof require('stream').Readable) {
        // AWS-SDK v3 has some issues with their typescript definitions, but this works
        // https://github.com/aws/aws-sdk-js-v3/issues/843
        // open the writable stream and write the file
        const file = fs.createWriteStream(file_name);
        file.on('open', () => {
          // @ts-ignore
          obj.Body?.pipe(file).on('finish', () => {
            return resolve(file_name);
          });
        });
      }

      // return file_name;
    } catch (err) {
      console.error(err);
      reject(err);
      // return null;
    }
  });
}

export async function removeFromS3(file_key: string) {
  try {
    const s3 = initS3();
    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
    };

    if (fs.existsSync(`/tmp/${file_key.split('uploads/')[1]}`))
      fs.unlinkSync(`/tmp/${file_key.split('uploads/')[1]}`);

    await s3.deleteObject(params);
  } catch (err) {
    console.error(err);
  }
}
