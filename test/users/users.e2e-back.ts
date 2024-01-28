import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import typia from 'typia';

import * as Apis from '../../src/api/functional';
import { AppModule } from '../../src/app.module';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';

// import assert from 'assert';

describe('E2E user test', () => {
  const host = 'http://127.0.0.1:4000';
  let app: INestApplication;
  let testingModule: TestingModule;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    describe('회원가입시 name 타입 검증', () => {
      it('만약 0자인 경우 ', async () => {
        const userInfo = typia.random<CreateUserDto>();
        // userInfo.name = '';
        const res = await Apis.users.postUser(
          {
            host,
          },
          userInfo,
        );
        console.log(res);

        // assert.notStrictEqual(res.status, 201);
      });
    });
  });

  // describe('get /users', () => {
  //   describe('유저 조회', () => {
  //     it('유저 조회 성공', async () => {
  //       const userId = 1;
  //       const res = await Apis.users.getUser(
  //         {
  //           host,
  //         },
  //         userId,
  //       );
  //       console.log(res);
  //     });
  //     it('유저 조회 실패', async () => {
  //       const userId = 999;
  //       const res = await Apis.users.getUser(
  //         {
  //           host,
  //         },
  //         userId,
  //       );
  //       console.log(res);
  //     });
  //   });
  // });
});
