import * as multerS3 from 'multer-s3';
import { S3 } from '@aws-sdk/client-s3';
import { MinioBucketConfig } from '../../../infrastructure/bucket/bucket.module';
import appEnv from '../../../common/app-env';
import { uuidv7 } from 'uuidv7';

const s3 = new S3(MinioBucketConfig);

export const multerOptions = {
  storage: multerS3({
    s3: s3,
    bucket: appEnv.bucketName,
    acl: 'public-read',
    key: (request, file, cb) => {
      cb(null, `${uuidv7()}-${file.originalname}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'), false);
    }
  },
};
