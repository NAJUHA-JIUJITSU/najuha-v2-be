import typia from 'typia';
import * as dotenv from 'dotenv';

const envPathMap = {
  dev: '.env.dev',
  test: '.env.test',
  prod: '.env.prod',
};

dotenv.config({ path: envPathMap[`${process.env.NODE_ENV}`] });

type appEnv = {
  // NODE_ENV ---------------------------------------------------------------------
  nodeEnv: string;
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
  // REDIS ----------------------------------------------------------------------------
  redisHost: string;
  redisPort: number;
  // JWT ---------------------------------------------------------------------------
  jwtAccessTokenSecret: string;
  jwtAccessTokenExpirationTime: string;
  jwtRefreshTokenSecret: string;
  jwtRefreshTokenExpirationTime: string;

  // ADMIN CREDENTIALS -------------------------------------------------------------
  adminCredentials: { snsId: string; snsAuthProvider: string }[];
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
    // REDIS ----------------------------------------------------------------------------
    redisHost: process.env.REDIS_HOST,
    redisPort: Number(process.env.REDIS_PORT),
    // JWT ---------------------------------------------------------------------------
    jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    jwtAccessTokenExpirationTime: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    jwtRefreshTokenExpirationTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    // ADMIN CREDENTIALS -------------------------------------------------------------
    adminCredentials: JSON.parse(process.env.ADMIN_CREDENTIALS_JSON || '[]'),
  };

  // Validate the config
  return typia.assert<appEnv>(rawConfig);
};

const appEnv = loadConfig();

export default appEnv;
