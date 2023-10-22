import fs from 'fs';
import { initS3 } from './s3';

export async function downloadFromS3(file_key: string) {
  try {
    const s3 = initS3();
    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
    };

    const obj = await s3.getObject(params).promise();

    const file_name = `./tmp/${file_key.split('uploads/')[1]}`;
    if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');
    if (fs.existsSync(file_name)) fs.unlinkSync(file_name);

    fs.writeFileSync(file_name, obj.Body as Buffer);
    return file_name;
  } catch (err) {
    console.error(err);
    return null;
  }
}
