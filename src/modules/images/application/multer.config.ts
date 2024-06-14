import * as multerS3 from 'multer-s3';
import { S3 } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { MinioBucketConfig } from '../../../infrastructure/bucket/bucket.module';
import appEnv from '../../../common/app-env';

const s3 = new S3(MinioBucketConfig);

export const multerOptions = {
  storage: multerS3({
    s3: s3,
    bucket: appEnv.bucketName,
    acl: 'public-read',
    key: (request, file, cb) => {
      cb(null, `${uuidv4()}-${file.originalname}`);
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
