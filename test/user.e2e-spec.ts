import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as Apis from '../src/api/functional';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import typia from 'typia';
// import assert from 'assert';

describe('E2E user test', () => {
  const host = 'http://127.0.0.1:3000';
  let app: INestApplication;
  let testingModule: TestingModule;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    await (await app.init()).listen(4000);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /user', () => {
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
});
