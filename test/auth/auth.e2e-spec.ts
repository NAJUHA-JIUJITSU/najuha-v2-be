import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import typia from 'typia';

import * as Apis from '../../src/api/functional';
import { AppModule } from '../../src/app.module';
import { SnsAuthDto } from '../../src/sns-auth/dto/sns-auth.dto';

// import assert from 'assert';

describe('E2E Auth test', () => {
  const NODE_ENV = process.env.NODE_ENV || 'test';
  const APP_PORT = process.env.APP_PORT || 9000;

  console.log('NODE_ENV: ', NODE_ENV);
  console.log('APP_PORT: ', APP_PORT);

  const END_POINT = `http://127.0.0.1:${APP_PORT}`;
  let app: INestApplication;
  let testingModule: TestingModule;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    (await app.init()).listen(APP_PORT);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/snsLogin', () => {
    it('SNS 로그인 성공 시', async () => {
      const loginInfo = typia.random<SnsAuthDto>();
      console.log(loginInfo);
      const res = await Apis.auth.snsLogin(
        {
          host: END_POINT,
        },
        loginInfo,
      );
      console.log(res);

      // assert.strictEqual(res.status, 201);
      // assert property checks for accessToken and refreshToken
    });

    // Additional test cases for snsLogin can be added here
  });

  //   describe('POST /auth/refresh', () => {
  //     it('토큰 리프레시 성공 시', async () => {
  //       const refreshTokenInfo = typia.random<RefreshTokenDto>();
  //       const res = await Apis.auth.refreshToken(
  //         {
  //           host,
  //         },
  //         refreshTokenInfo,
  //       );
  //       console.log(res);

  //       // assert.strictEqual(res.status, 201);
  //       // assert property checks for accessToken and refreshToken
  //     });

  //     // Additional test cases for refreshToken can be added here
  //   });

  // Additional test suites can be added here
});
