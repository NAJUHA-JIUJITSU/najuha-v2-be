import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import typia from 'typia';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import appEnv from '../../src/common/app-env';
import { ResponseForm } from 'src/common/response/response';
import { EntityManager, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import {
  REGISTER_NICKNAME_DUPLICATED,
  REGISTER_PHONE_NUMBER_REQUIRED,
  REGISTER_POLICY_CONSENT_REQUIRED,
} from 'src/common/response/errorResponse';
import { UsersAppService } from 'src/modules/users/application/users.app.service';
import { PolicyAppService } from 'src/modules/policy/application/policy.app.service';
import { IPolicy } from 'src/modules/policy/domain/interface/policy.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import {
  ConfirmAuthCodeRes,
  GetTemporaryUserRes,
  IsDuplicatedNicknameRes,
  RegisterUserRes,
  SendPhoneNumberAuthCodeRes,
} from 'src/modules/register/presentation/dtos';
import { UserEntity } from 'src/infrastructure/database/entity/user/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ulid } from 'ulid';

describe('E2E u-2 register test', () => {
  let app: INestApplication;
  let testingModule: TestingModule;
  let entityEntityManager: EntityManager;
  let tableNames: string;
  let redisClient: Redis;
  let jwtService: JwtService;
  let usersAppService: UsersAppService;
  let policyAppService: PolicyAppService;
  let userRepository: Repository<UserEntity>;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    entityEntityManager = testingModule.get<EntityManager>(EntityManager);
    tableNames = entityEntityManager.connection.entityMetadatas.map((entity) => `"${entity.tableName}"`).join(', ');
    redisClient = testingModule.get<Redis>('REDIS_CLIENT');
    jwtService = testingModule.get<JwtService>(JwtService);
    usersAppService = testingModule.get<UsersAppService>(UsersAppService);
    policyAppService = testingModule.get<PolicyAppService>(PolicyAppService);
    userRepository = testingModule.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
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
      const user = typia.random<Omit<IUser, 'createdAt' | 'updatedAt'>>();
      user.id = ulid();
      user.role = 'TEMPORARY_USER';
      user.birth = '19980101';
      await userRepository.save(userRepository.create(user));
      const myAccessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );

      const res = await request(app.getHttpServer())
        .get('/user/register/users/me')
        .set('Authorization', `Bearer ${myAccessToken}`);

      expect(typia.is<ResponseForm<GetTemporaryUserRes>>(res.body)).toBe(true);
      expect(res.body.result.user.id).toEqual(user.id);
    });
  });

  describe('u-2-2 GET /user/users/:nickname/is-duplicated ----------------------------', () => {
    it('닉네임 중복검사 - 중복된 닉네임인 경우', async () => {
      const ohterUser = typia.random<Omit<IUser, 'createdAt' | 'updatedAt'>>();
      ohterUser.id = ulid();
      ohterUser.role = 'TEMPORARY_USER';
      ohterUser.birth = '19980101';
      await userRepository.save(userRepository.create(ohterUser));

      const user = typia.random<Omit<IUser, 'createdAt' | 'updatedAt'>>();
      user.id = ulid();
      user.role = 'TEMPORARY_USER';
      user.birth = '19980101';
      await userRepository.save(userRepository.create(user));

      const userAccessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );

      const res = await request(app.getHttpServer())
        .get(`/user/register/users/${ohterUser.nickname}/is-duplicated`)
        .set('Authorization', `Bearer ${userAccessToken}`);

      expect(typia.is<ResponseForm<IsDuplicatedNicknameRes>>(res.body)).toBe(true);
      expect(res.body.result.isDuplicated).toEqual(true);
    });

    it('닉네임 중복검사 - 중복된 닉네임이지만 내가 사용중인 닉네임(사용가능)', async () => {
      const user = typia.random<Omit<IUser, 'createdAt' | 'updatedAt'>>();
      user.id = ulid();
      user.role = 'TEMPORARY_USER';
      user.birth = '19980101';
      await userRepository.save(userRepository.create(user));

      const myAccessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );

      const res = await request(app.getHttpServer())
        .get(`/user/register/users/${user.nickname}/is-duplicated`)
        .set('Authorization', `Bearer ${myAccessToken}`);

      expect(typia.is<ResponseForm<IsDuplicatedNicknameRes>>(res.body)).toBe(true);
      expect(res.body.result.isDuplicated).toEqual(false);
    });

    it('닉네임 중복검사 - 중복되지 않은 닉네임(사용가능)', async () => {
      const user = typia.random<Omit<IUser, 'createdAt' | 'updatedAt'>>();
      user.id = ulid();
      user.role = 'TEMPORARY_USER';
      user.birth = '19980101';
      await userRepository.save(userRepository.create(user));
      const accessToken = jwtService.sign(
        { userId: 1, userRole: 'TEMPORARY_USER' },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const unusedNickname = 'unusedNickname';

      const res = await request(app.getHttpServer())
        .get(`/user/register/users/${unusedNickname}/is-duplicated`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(typia.is<ResponseForm<IsDuplicatedNicknameRes>>(res.body)).toBe(true);
      expect(res.body.result.isDuplicated).toEqual(false);
    });
  });

  describe('u-2-3 POST /user/register/phone-number/auth-code', () => {
    it('전화번호로 인증코드 전송', async () => {
      const user = typia.random<Omit<IUser, 'createdAt' | 'updatedAt'>>();
      user.id = ulid();
      user.role = 'TEMPORARY_USER';
      user.birth = '19980101';
      await userRepository.save(userRepository.create(user));
      const userAccessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const res = await request(app.getHttpServer())
        .post('/user/register/phone-number/auth-code')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({ phoneNumber: '01012345678' });

      expect(typia.is<ResponseForm<SendPhoneNumberAuthCodeRes>>(res.body)).toBe(true);
    });
  });

  describe('u-2-4 POST /user/register/phone-number/authcode/confirm --------', () => {
    it('전화번호로 인증코드 확인 성공 시', async () => {
      const user = typia.random<Omit<IUser, 'createdAt' | 'updatedAt'>>();
      user.id = ulid();
      user.role = 'TEMPORARY_USER';
      user.birth = '19980101';
      await userRepository.save(userRepository.create(user));
      const userAccessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );

      // 이전에 전화번호로 전송된 인증코드가 레디스에 저장되어 있다고 가정.
      const authCode = '123456';
      const phoneNumber = '01012345678';
      redisClient.set(`userId:${user.id}-authCode:${authCode}`, phoneNumber, 'EX', 300);

      const res = await request(app.getHttpServer())
        .post(`/user/register/phone-number/auth-code/confirm`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({ authCode });
      expect(typia.is<ResponseForm<ConfirmAuthCodeRes>>(res.body)).toBe(true);
      expect(res.body.result.isConfirmed).toEqual(true);
    });

    it('전화번호로 인증코드 확인 실패 시', async () => {
      const user = typia.random<Omit<IUser, 'createdAt' | 'updatedAt'>>();
      user.id = ulid();
      user.role = 'TEMPORARY_USER';
      user.birth = '19980101';
      user.phoneNumber = null;
      await userRepository.save(userRepository.create(user));
      const userAccessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );

      // 이전에 전화번호로 전송된 인증코드가 레디스에 저장되어 있다고 가정.
      const authCode = '123456';
      const phoneNumber = '01012345678';
      redisClient.set(`userId:${user.id}-authCode:${authCode}`, phoneNumber, 'EX', 300);

      const wrongCode = '999999';
      const res = await request(app.getHttpServer())
        .post(`/user/register/phone-number/auth-code/confirm`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({ authCode: wrongCode });
      expect(typia.is<ResponseForm<ConfirmAuthCodeRes>>(res.body)).toBe(true);
      expect(res.body.result.isConfirmed).toEqual(false);
    });
  });

  describe('u-2-5 PATCH /user/register ------------------------------------------------', () => {
    it('유저 등록 성공 시', async () => {
      const policyTypes: IPolicy['type'][] = ['TERMS_OF_SERVICE', 'PRIVACY', 'REFUND', 'ADVERTISEMENT'];
      const ret = await Promise.all(
        policyTypes.map((type) => {
          return policyAppService.createPolicy({
            policyCreateDto: {
              type: type,
              isMandatory: true,
              title: `${type} 제목`,
              content: `${type} 내용`,
            },
          });
        }),
      );

      const user = typia.random<Omit<IUser, 'createdAt' | 'updatedAt'>>();
      user.id = ulid();
      user.role = 'TEMPORARY_USER';
      user.birth = '19980101';
      user.phoneNumber = '01012345678';
      await userRepository.save(userRepository.create(user));
      const userAccessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );

      const res = await request(app.getHttpServer())
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
        });
      expect(typia.is<ResponseForm<RegisterUserRes>>(res.body)).toBe(true);
    });

    it('유저 등록 실패 시 - 닉네임 중복', async () => {
      const policyTypes: IPolicy['type'][] = ['TERMS_OF_SERVICE', 'PRIVACY', 'REFUND', 'ADVERTISEMENT'];
      await Promise.all(
        policyTypes.map((type) => {
          return policyAppService.createPolicy({
            policyCreateDto: {
              type: type,
              isMandatory: true,
              title: `${type} 제목`,
              content: `${type} 내용`,
            },
          });
        }),
      );

      const ohterUser = typia.random<Omit<IUser, 'createdAt' | 'updatedAt'>>();
      ohterUser.id = ulid();
      ohterUser.role = 'TEMPORARY_USER';
      ohterUser.birth = '19980101';
      ohterUser.phoneNumber = '01012345678';
      ohterUser.nickname = 'existingNickname';
      await userRepository.save(userRepository.create(ohterUser));

      const user = typia.random<Omit<IUser, 'createdAt' | 'updatedAt'>>();
      user.id = ulid();
      user.role = 'TEMPORARY_USER';
      user.birth = '19980101';
      user.phoneNumber = '01012345678';
      user.nickname = null;
      await userRepository.save(userRepository.create(user));
      const userAccessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );

      const res = await request(app.getHttpServer())
        .patch('/user/register')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          user: {
            nickname: ohterUser.nickname,
            birth: '19980101',
            belt: '블랙',
            gender: 'MALE',
          },
          consentPolicyTypes: policyTypes,
        });
      expect(typia.is<REGISTER_NICKNAME_DUPLICATED>(res.body)).toBe(true);
    });

    it('유저 등록 실패 시 - 필수 약관 미동의', async () => {
      const policyTypes: IPolicy['type'][] = ['TERMS_OF_SERVICE', 'PRIVACY', 'REFUND', 'ADVERTISEMENT'];
      await Promise.all(
        policyTypes.map((type) => {
          return policyAppService.createPolicy({
            policyCreateDto: {
              type: type,
              isMandatory: true,
              title: `${type} 제목`,
              content: `${type} 내용`,
            },
          });
        }),
      );

      const user = typia.random<Omit<IUser, 'createdAt' | 'updatedAt'>>();
      user.id = ulid();
      user.role = 'TEMPORARY_USER';
      user.birth = '19980101';
      user.phoneNumber = '01012345678';
      user.nickname = null;
      await userRepository.save(userRepository.create(user));
      const userAccessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );

      const res = await request(app.getHttpServer())
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
        });
      console.log(res.body);
      expect(typia.is<REGISTER_POLICY_CONSENT_REQUIRED>(res.body)).toBe(true);
    });

    it('유저 등록 실패 시 - 전화번호 미등록', async () => {
      const policyTypes: IPolicy['type'][] = ['TERMS_OF_SERVICE', 'PRIVACY', 'REFUND', 'ADVERTISEMENT'];
      await Promise.all(
        policyTypes.map((type) => {
          return policyAppService.createPolicy({
            policyCreateDto: {
              type: type,
              isMandatory: true,
              title: `${type} 제목`,
              content: `${type} 내용`,
            },
          });
        }),
      );

      const user = typia.random<Omit<IUser, 'createdAt' | 'updatedAt'>>();
      user.id = ulid();
      user.role = 'TEMPORARY_USER';
      user.birth = '19980101';
      user.phoneNumber = null;
      await userRepository.save(userRepository.create(user));
      const userAccessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );

      const res = await request(app.getHttpServer())
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
        });
      expect(typia.is<REGISTER_PHONE_NUMBER_REQUIRED>(res.body)).toBe(true);
    });
  });
});
