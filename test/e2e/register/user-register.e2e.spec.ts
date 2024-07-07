import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import typia from 'typia';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import appEnv from '../../../src/common/app-env';
import { ResponseForm } from '../../../src/common/response/response';
import { EntityManager } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import {
  REGISTER_NICKNAME_DUPLICATED,
  REGISTER_PHONE_NUMBER_REQUIRED,
  REGISTER_POLICY_CONSENT_REQUIRED,
} from '../../../src/common/response/errorResponse';
import { IPolicy } from '../../../src/modules/policy/domain/interface/policy.interface';
import {
  ConfirmAuthCodeRes,
  GetTemporaryUserRes,
  IsDuplicatedNicknameRes,
  RegisterUserRes,
  SendPhoneNumberAuthCodeRes,
} from '../../../src/modules/register/presentation/register.controller.dto';
import { UserEntity } from '../../../src/database/entity/user/user.entity';
import { uuidv7 } from 'uuidv7';
import { UserDummyBuilder } from '../../../src/dummy/user.dummy';
import { PolicyEntity } from '../../../src/database/entity/policy/policy.entity';
import { TemporaryUserEntity } from '../../../src/database/entity/user/temporary-user.entity';
import { TemporaryUserDummyBuilder } from '../../../src/dummy/temporary-user.dummy';

describe('E2E u-2 register test', () => {
  let app: INestApplication;
  let testingModule: TestingModule;
  let entityEntityManager: EntityManager;
  let tableNames: string;
  let redisClient: Redis;
  let jwtService: JwtService;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    entityEntityManager = testingModule.get<EntityManager>(EntityManager);
    tableNames = entityEntityManager.connection.entityMetadatas.map((entity) => `"${entity.tableName}"`).join(', ');
    redisClient = testingModule.get<Redis>('REDIS_CLIENT');
    jwtService = testingModule.get<JwtService>(JwtService);
    (await app.init()).listen(appEnv.appPort);
  });

  afterEach(async () => {
    await entityEntityManager.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`);
    await redisClient.flushall();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('u-2-1 GET /user/users/me --------------------------------------------------', () => {
    it('TEMPORARY_USER 권한으로 내 정보 조회 성공 시', async () => {
      /** pre condition. */
      const tempraryUser = new TemporaryUserDummyBuilder().build();
      await entityEntityManager.save(TemporaryUserEntity, tempraryUser);
      const myAccessToken = jwtService.sign(
        { userId: tempraryUser.id, userRole: tempraryUser.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      /** main test. */
      const getUserResBody = await request(app.getHttpServer())
        .get('/user/register/users/me')
        .set('Authorization', `Bearer ${myAccessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<GetTemporaryUserRes>>(res.body);
        });
      expect(getUserResBody.result.user.id).toEqual(tempraryUser.id);
    });
  });

  describe('u-2-2 GET /user/users/:nickname/is-duplicated ----------------------------', () => {
    it('닉네임 중복검사 - 중복된 닉네임인 경우', async () => {
      /** pre condition. */
      const otherUser = new UserDummyBuilder().setNickname('otherUserNickname').build();
      await entityEntityManager.save(UserEntity, otherUser);
      const temporaryUser = new TemporaryUserDummyBuilder().build();
      await entityEntityManager.save(TemporaryUserEntity, temporaryUser);
      const userAccessToken = jwtService.sign(
        { userId: temporaryUser.id, userRole: temporaryUser.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      /** main test. */
      const isDuplicatedResBody = await request(app.getHttpServer())
        .get(`/user/register/users/${otherUser.nickname}/is-duplicated`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<IsDuplicatedNicknameRes>>(res.body);
        });
      expect(isDuplicatedResBody.result.isDuplicated).toEqual(true);
    });

    it('닉네임 중복검사 - 중복된 닉네임이지만 내가 사용중인 닉네임(사용가능)', async () => {
      /** pre condition. */
      const tempraryUser = new TemporaryUserDummyBuilder().setNickname('myNickname').build();
      await entityEntityManager.save(TemporaryUserEntity, tempraryUser);
      const myAccessToken = jwtService.sign(
        { userId: tempraryUser.id, userRole: tempraryUser.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      /** main test. */
      const isDuplicatedResBody = await request(app.getHttpServer())
        .get(`/user/register/users/${tempraryUser.nickname}/is-duplicated`)
        .set('Authorization', `Bearer ${myAccessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<IsDuplicatedNicknameRes>>(res.body);
        });
      expect(isDuplicatedResBody.result.isDuplicated).toEqual(false);
    });

    it('닉네임 중복검사 - 중복되지 않은 닉네임(사용가능)', async () => {
      /** pre condition. */
      const temporaryUser = new TemporaryUserDummyBuilder().build();
      await entityEntityManager.save(TemporaryUserEntity, temporaryUser);
      const accessToken = jwtService.sign(
        { userId: temporaryUser.id, userRole: temporaryUser.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const unusedNickname = 'unusedNickname';
      /** main test. */
      const isDuplicatedResBody = await request(app.getHttpServer())
        .get(`/user/register/users/${unusedNickname}/is-duplicated`)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<IsDuplicatedNicknameRes>>(res.body);
        });
      expect(isDuplicatedResBody.result.isDuplicated).toEqual(false);
    });
  });

  describe('u-2-3 POST /user/register/phone-number/auth-code', () => {
    it('전화번호로 인증코드 전송', async () => {
      /** pre condition. */
      const temporaryUser = new TemporaryUserDummyBuilder().build();
      await entityEntityManager.save(TemporaryUserEntity, temporaryUser);
      const userAccessToken = jwtService.sign(
        { userId: temporaryUser.id, userRole: temporaryUser.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      /** main test. */
      const sendAuthCodeResBody = await request(app.getHttpServer())
        .post('/user/register/phone-number/auth-code')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({ phoneNumber: '01012345678' })
        .then((res) => {
          return typia.assert<ResponseForm<SendPhoneNumberAuthCodeRes>>(res.body);
        });
    });
  });

  describe('u-2-4 POST /user/register/phone-number/authcode/confirm --------', () => {
    it('전화번호로 인증코드 확인 성공 시', async () => {
      const temporaryUser = new TemporaryUserDummyBuilder().build();
      await entityEntityManager.save(TemporaryUserEntity, temporaryUser);
      const userAccessToken = jwtService.sign(
        { userId: temporaryUser.id, userRole: temporaryUser.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      // 이전에 전화번호로 전송된 인증코드가 레디스에 저장되어 있다고 가정.
      const authCode = '123456';
      const phoneNumber = '01012345678';
      redisClient.set(
        `userId:${temporaryUser.id}-authCode:${authCode}`,
        phoneNumber,
        'EX',
        appEnv.redisPhoneNumberAuthCodeExpirationTime,
      );
      /** main test. */
      const confirmAuthCodeResBody = await request(app.getHttpServer())
        .post(`/user/register/phone-number/auth-code/confirm`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({ authCode })
        .then((res) => {
          return typia.assert<ResponseForm<ConfirmAuthCodeRes>>(res.body);
        });
      expect(confirmAuthCodeResBody.result.isConfirmed).toEqual(true);
    });

    it('전화번호로 인증코드 확인 실패 시', async () => {
      /** pre condition. */
      const temporaryUser = new TemporaryUserDummyBuilder().build();
      await entityEntityManager.save(TemporaryUserEntity, temporaryUser);
      const userAccessToken = jwtService.sign(
        { userId: temporaryUser.id, userRole: temporaryUser.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      // 이전에 전화번호로 전송된 인증코드가 레디스에 저장되어 있다고 가정.
      const authCode = '123456';
      const phoneNumber = '01012345678';
      redisClient.set(
        `userId:${temporaryUser.id}-authCode:${authCode}`,
        phoneNumber,
        'EX',
        appEnv.redisPhoneNumberAuthCodeExpirationTime,
      );
      /** main test. */
      const wrongCode = '999999';
      const confirmAuthCodeResBody = await request(app.getHttpServer())
        .post(`/user/register/phone-number/auth-code/confirm`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({ authCode: wrongCode })
        .then((res) => {
          return typia.assert<ResponseForm<ConfirmAuthCodeRes>>(res.body);
        });
      expect(confirmAuthCodeResBody.result.isConfirmed).toEqual(false);
    });
  });

  describe('u-2-5 PATCH /user/register ------------------------------------------------', () => {
    it('유저 등록 성공 시', async () => {
      /** pre condition. */
      const policyTypes: IPolicy['type'][] = ['TERMS_OF_SERVICE', 'PRIVACY', 'REFUND', 'ADVERTISEMENT'];
      await Promise.all(
        policyTypes.map((type) => {
          return entityEntityManager.save(PolicyEntity, {
            id: uuidv7(),
            type,
            isMandatory: true,
            title: `${type} 제목`,
            content: `${type} 내용`,
            version: 1,
            createdAt: new Date(),
          });
        }),
      );
      const temporaryUser = new TemporaryUserDummyBuilder().setPhoneNumber('01012345678').build(); // 전화번호 인증을 완료 했다고 가정.
      await entityEntityManager.save(TemporaryUserEntity, temporaryUser);
      const temporaryUserAccessToken = jwtService.sign(
        { userId: temporaryUser.id, userRole: temporaryUser.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      /** main test. */
      const registerUserResBody = await request(app.getHttpServer())
        .patch('/user/register')
        .set('Authorization', `Bearer ${temporaryUserAccessToken}`)
        .send({
          user: {
            nickname: 'nickname',
            birth: '19980101',
            belt: '블랙',
            gender: 'MALE',
          },
          consentPolicyTypes: policyTypes,
        })
        .then((res) => {
          return typia.assert<ResponseForm<RegisterUserRes>>(res.body);
        });
    });

    it('유저 등록 실패 시 - 닉네임 중복', async () => {
      /** pre condition. */
      const policyTypes: IPolicy['type'][] = ['TERMS_OF_SERVICE', 'PRIVACY', 'REFUND', 'ADVERTISEMENT'];
      await Promise.all(
        policyTypes.map((type) => {
          return entityEntityManager.save(PolicyEntity, {
            id: uuidv7(),
            type,
            isMandatory: true,
            title: `${type} 제목`,
            content: `${type} 내용`,
            version: 1,
            createdAt: new Date(),
          });
        }),
      );
      const otherUser = new UserDummyBuilder().setNickname('otherUserNickname').build();
      await entityEntityManager.save(UserEntity, otherUser);
      const temporaryUser = new TemporaryUserDummyBuilder().setPhoneNumber('01012345678').build(); // 전화번호 인증을 완료 했다고 가정.
      await entityEntityManager.save(TemporaryUserEntity, temporaryUser);
      const userAccessToken = jwtService.sign(
        { userId: temporaryUser.id, userRole: temporaryUser.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      /** main test. */
      const registerUserResBody = await request(app.getHttpServer())
        .patch('/user/register')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          user: {
            nickname: otherUser.nickname,
            birth: '19980101',
            belt: '블랙',
            gender: 'MALE',
          },
          consentPolicyTypes: policyTypes,
        })
        .then((res) => {
          return typia.assert<REGISTER_NICKNAME_DUPLICATED>(res.body);
        });
    });

    it('유저 등록 실패 시 - 필수 약관 미동의', async () => {
      /** pre condition. */
      const policyTypes: IPolicy['type'][] = ['TERMS_OF_SERVICE', 'PRIVACY', 'REFUND', 'ADVERTISEMENT'];
      await Promise.all(
        policyTypes.map((type) => {
          return entityEntityManager.save(PolicyEntity, {
            id: uuidv7(),
            type,
            isMandatory: true,
            title: `${type} 제목`,
            content: `${type} 내용`,
            version: 1,
            createdAt: new Date(),
          });
        }),
      );
      const temporaryUser = new TemporaryUserDummyBuilder().setPhoneNumber('01012345678').build(); // 전화번호 인증을 완료 했다고 가정.
      await entityEntityManager.save(TemporaryUserEntity, temporaryUser);
      const userAccessToken = jwtService.sign(
        { userId: temporaryUser.id, userRole: temporaryUser.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      /** main test. */
      const registerUserResBody = await request(app.getHttpServer())
        .patch('/user/register')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          user: {
            nickname: 'nickname',
            birth: '19980101',
            belt: '블랙',
            gender: 'MALE',
          },
          consentPolicyTypes: ['TERMS_OF_SERVICE', 'PRIVACY'],
        })
        .then((res) => {
          return typia.assert<REGISTER_POLICY_CONSENT_REQUIRED>(res.body);
        });
    });

    it('유저 등록 실패 시 - 전화번호 미등록', async () => {
      /** pre condition. */
      const policyTypes: IPolicy['type'][] = ['TERMS_OF_SERVICE', 'PRIVACY', 'REFUND', 'ADVERTISEMENT'];
      await Promise.all(
        policyTypes.map((type) => {
          return entityEntityManager.save(PolicyEntity, {
            id: uuidv7(),
            type,
            isMandatory: true,
            title: `${type} 제목`,
            content: `${type} 내용`,
            version: 1,
            createdAt: new Date(),
          });
        }),
      );
      const temporaryUser = new TemporaryUserDummyBuilder().build();
      await entityEntityManager.save(TemporaryUserEntity, temporaryUser);
      const userAccessToken = jwtService.sign(
        { userId: temporaryUser.id, userRole: temporaryUser.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      /** main test. */
      const registerUserResBody = await request(app.getHttpServer())
        .patch('/user/register')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          user: {
            nickname: 'nickname',
            birth: '19980101',
            belt: '블랙',
            gender: 'MALE',
          },
          consentPolicyTypes: policyTypes,
        })
        .then((res) => {
          return typia.assert<REGISTER_PHONE_NUMBER_REQUIRED>(res.body);
        });
    });
  });
});
