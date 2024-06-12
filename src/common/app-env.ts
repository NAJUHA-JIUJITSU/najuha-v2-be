import typia from 'typia';
import * as dotenv from 'dotenv';
import { IUser } from '../modules/users/domain/interface/user.interface';

const envPathMap = {
  dev: '.env.dev',
  test: '.env.test',
  prod: '.env.prod',
  performance: '.env.performance',
};

dotenv.config({ path: envPathMap[`${process.env.NODE_ENV}`] });

type appEnv = {
  // NODE_ENV ---------------------------------------------------------------------
  nodeEnv: 'dev' | 'test' | 'prod' | 'performance';
  // APP --------------------------------------------------------------------------
  appPort: number;
  // KAKAO API --------------------------------------------------------------------
  kakaoRestApiKey: string;
  kakaoCallbackUrl: string;
  // NAVER API --------------------------------------------------------------------
  naverClientId: string;
  naverClientSecret: string;
  naverCallbackUrl: string;
  // GOOGLE API -------------------------------------------------------------------
  googleClientId: string;
  googleClientSecret: string;
  googleCallbackUrl: string;
  // DB ----------------------------------------------------------------------------
  dbType: 'postgres' | 'sqlite';
  dbHost: string;
  dbPort: number;
  dbUsername: string;
  dbpassword: string;
  dbDatabase: string;
  dbSynchronize: boolean;
  // REDIS -------------------------------------------------------------------------
  redisHost: string;
  redisPort: number;
  // REDIS EXPIRATION TIME ---------------------------------------------------------
  redisPhoneNumberAuthCodeExpirationTime: number;
  redisRefreshTokenExpirationTime: number;
  redisViewCountExpirationTime: number;
  // JWT ---------------------------------------------------------------------------
  jwtAccessTokenSecret: string;
  jwtAccessTokenExpirationTime: string;
  jwtRefreshTokenSecret: string;
  jwtRefreshTokenExpirationTime: string;
  // MINIO -------------------------------------------------------------------------
  minioHost: string;
  minioPort: number;
  minioConsolePort: number;
  minioAccessKeyId: string;
  minioSecretAccesstKey: string;
  minioBucket: string;
  minioRegion: string;
  // S3 ----------------------------------------------------------------------------
  s3Region: string;
  s3AccessKeyId: string;
  s3SecretAccessKey: string;
  s3Bucket: string;
  // PRESIGNED IMAGE ---------------------------------------------------------------
  presignedImageUrlExpiresTime: number;
  presignedImageMaxSize: number;
  // ADMIN CREDENTIALS -------------------------------------------------------------
  adminCredentials: { snsId: string; snsAuthProvider: IUser['snsAuthProvider']; id: string; name: string }[];
};

const loadConfig = (): appEnv => {
  const rawConfig = {
    // NODE_ENV ---------------------------------------------------------------------
    nodeEnv: process.env.NODE_ENV,
    // APP --------------------------------------------------------------------------
    appPort: Number(process.env.APP_PORT),
    // KAKAO API --------------------------------------------------------------------
    kakaoRestApiKey: process.env.KAKAO_REST_API_KEY,
    kakaoCallbackUrl: process.env.KAKAO_CALLBACK_URL,
    // NAVER API --------------------------------------------------------------------
    naverClientId: process.env.NAVER_CLIENT_ID,
    naverClientSecret: process.env.NAVER_CLIENT_SECRET,
    naverCallbackUrl: process.env.NAVER_CALLBACK_URL,
    // GOOGLE API -------------------------------------------------------------------
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
    // DB ----------------------------------------------------------------------------
    dbType: process.env.DB_TYPE,
    dbHost: process.env.DB_HOST,
    dbPort: Number(process.env.DB_PORT),
    dbUsername: process.env.DB_USERNAME,
    dbpassword: process.env.DB_PASSWORD,
    dbDatabase: process.env.DB_DATABASE,
    dbSynchronize: process.env.DB_SYNCHRONIZE === 'true',
    // REDIS --------------------------------------------------------------------------
    redisHost: process.env.REDIS_HOST,
    redisPort: Number(process.env.REDIS_PORT),
    // REDIS EXPIRATION TIME ---------------------------------------------------------
    redisPhoneNumberAuthCodeExpirationTime: Number(process.env.REDIS_PHONE_NUMBER_AUTH_CODE_EXPIRATION_TIME),
    redisRefreshTokenExpirationTime: Number(process.env.REDIS_REFRESH_TOKEN_EXPIRATION_TIME),
    redisViewCountExpirationTime: Number(process.env.REDIS_VIEW_COUNT_EXPIRATION_TIME),
    // JWT ---------------------------------------------------------------------------
    jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    jwtAccessTokenExpirationTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    jwtRefreshTokenExpirationTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    // MINIO -------------------------------------------------------------------------
    minioHost: process.env.MINIO_HOST,
    minioPort: Number(process.env.MINIO_PORT),
    minioConsolePort: Number(process.env.MINIO_CONSOLE_PORT),
    minioAccessKeyId: process.env.MINIO_ACCESS_KEY_ID,
    minioSecretAccesstKey: process.env.MINIO_SECRET_ACCESS_KEY,
    minioBucket: process.env.MINIO_BUCKET,
    minioRegion: process.env.MINIO_REGION,
    // S3 ----------------------------------------------------------------------------
    s3Region: process.env.S3_REGION,
    s3AccessKeyId: process.env.S3_ACCESS_KEY_ID,
    s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    s3Bucket: process.env.S3_BUCKET,
    // PRESIGNED IMAGE ---------------------------------------------------------------
    presignedImageUrlExpiresTime: Number(process.env.PRESIGNED_IMAGE_URL_EXPIRATION_TIME),
    presignedImageMaxSize: Number(process.env.PRESIGNED_IMAGE_MAX_SIZE),
    // ADMIN CREDENTIALS -------------------------------------------------------------
    adminCredentials: JSON.parse(process.env.ADMIN_CREDENTIALS_JSON || '[]'),
  };

  // Validate the config
  return typia.assert<appEnv>(rawConfig);
};

const appEnv = loadConfig();

console.log('appEnv: ', appEnv);

export default appEnv;
