import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import typia from 'typia';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import appEnv from '../../../src/common/app-env';
import { ResponseForm } from '../../../src/common/response/response';
import {
  AUTH_REFRESH_TOKEN_UNAUTHORIZED,
  AUTH_UNREGISTERED_ADMIN_CREDENTIALS,
  BusinessException,
  SNS_AUTH_GOOGLE_LOGIN_FAIL,
  SNS_AUTH_KAKAO_LOGIN_FAIL,
  SNS_AUTH_NAVER_LOGIN_FAIL,
  SnsAuthErrors,
} from '../../../src/common/response/errorResponse';
import { KakaoStrategy } from '../../../src/modules/sns-auth-client/kakao.strategy';
import { NaverStrategy } from '../../../src/modules/sns-auth-client/naver.strategy';
import { GoogleStrategy } from '../../../src/modules/sns-auth-client/google.strategy';
import { DataSource, EntityManager } from 'typeorm';
import { UsersAppService } from '../../../src/modules/users/application/users.app.service';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import { ISnsAuthValidatedUserData } from '../../../src/modules/sns-auth-client/interface/validated-user-data.interface';
import { UserEntity } from '../../../src/database/entity/user/user.entity';
import { UserDummyBuilder } from '../../../src/dummy/user.dummy';
import {
  AcquireAdminRoleRes,
  RefreshTokenRes,
  SnsLoginReqBody,
  SnsLoginRes,
} from '../../../src/modules/auth/presentation/auth.controller.dto';

describe('E2E u-1 user-auth test', () => {
  let app: INestApplication;
  let testingModule: TestingModule;
  let dataSource: DataSource;
  let entityEntityManager: EntityManager;
  let tableNames: string;
  let redisClient: Redis;
  let jwtService: JwtService;
  let userService: UsersAppService;
  let kakaoStrategy: KakaoStrategy;
  let naverStrategy: NaverStrategy;
  let googleStrategy: GoogleStrategy;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    dataSource = testingModule.get<DataSource>(DataSource);
    entityEntityManager = testingModule.get<EntityManager>(EntityManager);
    tableNames = entityEntityManager.connection.entityMetadatas.map((entity) => `"${entity.tableName}"`).join(', ');
    redisClient = testingModule.get<Redis>('REDIS_CLIENT');
    jwtService = testingModule.get<JwtService>(JwtService);
    userService = testingModule.get<UsersAppService>(UsersAppService);
    kakaoStrategy = testingModule.get<KakaoStrategy>(KakaoStrategy);
    naverStrategy = testingModule.get<NaverStrategy>(NaverStrategy);
    googleStrategy = testingModule.get<GoogleStrategy>(GoogleStrategy);
    (await app.init()).listen(appEnv.appPort);
  });

  afterEach(async () => {
    await entityEntityManager.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`);
    await redisClient.flushall();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('u-1-1 POST /user/auth/sns-login ------------------------------------------', () => {
    it('KAKAO 기존 유저 로그인 성공 시', async () => {
      /** pre condition. */
      const existDummyUser = new UserDummyBuilder().setRole('USER').setSnsAuthProvider('KAKAO').build();
      await entityEntityManager.save(UserEntity, existDummyUser);
      jest.spyOn(kakaoStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret: ISnsAuthValidatedUserData = {
          snsId: existDummyUser.snsId,
          snsAuthProvider: existDummyUser.snsAuthProvider,
          name: existDummyUser.name,
          email: existDummyUser.email,
          phoneNumber: existDummyUser.phoneNumber,
          gender: existDummyUser.gender,
        };
        return ret;
      });
      /** main test. */
      const snsLoginReqBody: SnsLoginReqBody = {
        snsAuthCode: 'test-sns-auth-code',
        snsAuthProvider: existDummyUser.snsAuthProvider,
      };
      const snsLoginResBody = await request(app.getHttpServer())
        .post('/user/auth/sns-login')
        .send(snsLoginReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<SnsLoginRes>>(res.body);
        });
      const decodedToken = jwtService.decode(snsLoginResBody.result.authTokens.accessToken);
      expect(decodedToken.userRole).toBe('USER');
    });

    it('KAKAO 신규 유저 로그인 성공 시', async () => {
      /** pre condition. */
      const snsAuthProvider = 'KAKAO';
      jest.spyOn(kakaoStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret = typia.random<ISnsAuthValidatedUserData>();
        ret.snsAuthProvider = snsAuthProvider;
        return ret;
      });
      /** main test. */
      const snsLoginReqBody: SnsLoginReqBody = {
        snsAuthCode: 'test-sns-auth-code',
        snsAuthProvider,
      };
      const snsLoginResBody = await request(app.getHttpServer())
        .post('/user/auth/sns-login')
        .send(snsLoginReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<SnsLoginRes>>(res.body);
        });
      const decodedToken = jwtService.decode(snsLoginResBody.result.authTokens.accessToken);
      expect(decodedToken.userRole).toBe('TEMPORARY_USER');
    });

    it('KAKAO 로그인 실패 시', async () => {
      /** pre condition. */
      const snsAuthProvider = 'KAKAO';
      jest.spyOn(kakaoStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        throw new BusinessException(SnsAuthErrors.SNS_AUTH_KAKAO_LOGIN_FAIL, 'test error message');
      });
      /** main test. */
      const snsLoginReqBody: SnsLoginReqBody = {
        snsAuthCode: 'test-sns-auth-code',
        snsAuthProvider,
      };
      const snsLoginResBody = await request(app.getHttpServer())
        .post('/user/auth/sns-login')
        .send(snsLoginReqBody)
        .then((res) => {
          return typia.assert<SNS_AUTH_KAKAO_LOGIN_FAIL>(res.body);
        });
    });

    it('NAVER 기존 유저 로그인 성공 시', async () => {
      /** pre condition. */
      const existDummyUser = new UserDummyBuilder().setRole('USER').setSnsAuthProvider('NAVER').build();
      await entityEntityManager.save(UserEntity, existDummyUser);
      jest.spyOn(naverStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret: ISnsAuthValidatedUserData = {
          snsId: existDummyUser.snsId,
          snsAuthProvider: existDummyUser.snsAuthProvider,
          name: existDummyUser.name,
          email: existDummyUser.email,
          phoneNumber: existDummyUser.phoneNumber,
          gender: existDummyUser.gender,
        };
        return ret;
      });
      /** main test. */
      const snsLoginReqBody: SnsLoginReqBody = {
        snsAuthCode: 'test-sns-auth-code',
        snsAuthProvider: existDummyUser.snsAuthProvider,
      };
      const snsLoginResBody = await request(app.getHttpServer())
        .post('/user/auth/sns-login')
        .send(snsLoginReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<SnsLoginRes>>(res.body);
        });
      const decodedToken = jwtService.decode(snsLoginResBody.result.authTokens.accessToken);
      expect(decodedToken.userRole).toBe('USER');
    });

    it('NAVER 신규 유저 로그인 성공 시', async () => {
      /** pre condition. */
      const snsAuthProvider = 'NAVER';
      jest.spyOn(naverStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret = typia.random<ISnsAuthValidatedUserData>();
        ret.snsAuthProvider = snsAuthProvider;
        return ret;
      });
      /** main test. */
      const snsLoginReqBody: SnsLoginReqBody = {
        snsAuthCode: 'test-sns-auth-code',
        snsAuthProvider,
      };
      const snsLoginResBody = await request(app.getHttpServer())
        .post('/user/auth/sns-login')
        .send(snsLoginReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<SnsLoginRes>>(res.body);
        });
      const decodedToken = jwtService.decode(snsLoginResBody.result.authTokens.accessToken);
      expect(decodedToken.userRole).toBe('TEMPORARY_USER');
    });

    it('NAVER 로그인 실패 시', async () => {
      /** pre condition. */
      const snsAuthProvider = 'NAVER';
      jest.spyOn(naverStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        throw new BusinessException(SnsAuthErrors.SNS_AUTH_NAVER_LOGIN_FAIL, 'test error message');
      });
      /** main test. */
      const snsLoginReqBody: SnsLoginReqBody = {
        snsAuthCode: 'test-sns-auth-code',
        snsAuthProvider,
      };
      const snsLoginResBody = await request(app.getHttpServer())
        .post('/user/auth/sns-login')
        .send(snsLoginReqBody)
        .then((res) => {
          return typia.assert<SNS_AUTH_NAVER_LOGIN_FAIL>(res.body);
        });
    });

    it('GOOGLE 기존 유저 로그인 성공 시', async () => {
      /** pre condition. */
      const existDummyUser = new UserDummyBuilder().setRole('USER').setSnsAuthProvider('GOOGLE').build();
      await entityEntityManager.save(UserEntity, existDummyUser);
      jest.spyOn(googleStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret: ISnsAuthValidatedUserData = {
          snsId: existDummyUser.snsId,
          snsAuthProvider: existDummyUser.snsAuthProvider,
          name: existDummyUser.name,
          email: existDummyUser.email,
          phoneNumber: existDummyUser.phoneNumber,
          gender: existDummyUser.gender,
        };
        return ret;
      });
      /** main test. */
      const snsLoginReqBody: SnsLoginReqBody = {
        snsAuthCode: 'test-sns-auth-code',
        snsAuthProvider: existDummyUser.snsAuthProvider,
      };
      const snsLoginResBody = await request(app.getHttpServer())
        .post('/user/auth/sns-login')
        .send(snsLoginReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<SnsLoginRes>>(res.body);
        });
      const decodedToken = jwtService.decode(snsLoginResBody.result.authTokens.accessToken);
      expect(decodedToken.userRole).toBe('USER');
    });

    it('GOOGLE 신규 유저 로그인 성공 시', async () => {
      /** pre condition. */
      const snsAuthProvider = 'GOOGLE';
      jest.spyOn(googleStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret = typia.random<ISnsAuthValidatedUserData>();
        ret.snsAuthProvider = snsAuthProvider;
        return ret;
      });
      /** main test. */
      const snsLoginReqBody: SnsLoginReqBody = {
        snsAuthCode: 'test-sns-auth-code',
        snsAuthProvider,
      };
      const snsLoginResBody = await request(app.getHttpServer())
        .post('/user/auth/sns-login')
        .send(snsLoginReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<SnsLoginRes>>(res.body);
        });
      const decodedToken = jwtService.decode(snsLoginResBody.result.authTokens.accessToken);
      expect(decodedToken.userRole).toBe('TEMPORARY_USER');
    });

    it('GOOGLE 로그인 실패 시', async () => {
      /** pre condition. */
      const snsAuthProvider = 'GOOGLE';
      jest.spyOn(googleStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        throw new BusinessException(SnsAuthErrors.SNS_AUTH_GOOGLE_LOGIN_FAIL, 'test error message');
      });
      /** main test. */
      const snsLoginReqBody: SnsLoginReqBody = {
        snsAuthCode: 'test-sns-auth-code',
        snsAuthProvider,
      };
      const snsLoginResBody = await request(app.getHttpServer())
        .post('/user/auth/sns-login')
        .send(snsLoginReqBody)
        .then((res) => {
          return typia.assert<SNS_AUTH_GOOGLE_LOGIN_FAIL>(res.body);
        });
    });
  });

  describe('u-1-2 POST /user/auth/token -------------------------------------------------', () => {
    it('refresh token이 유효한 경우', async () => {
      /** pre condition. */
      const payload = {
        userId: 1,
        userRole: 'USER',
      };
      const authorizedRefreshToken = jwtService.sign(payload, {
        secret: appEnv.jwtRefreshTokenSecret,
        expiresIn: appEnv.jwtRefreshTokenExpirationTime,
      });
      await redisClient.set(`userId:${payload.userId}:refreshToken`, authorizedRefreshToken);
      /** main test. */
      const refreshTokenRes = await request(app.getHttpServer())
        .post('/user/auth/token')
        .send({ refreshToken: authorizedRefreshToken })
        .then((res) => {
          return typia.assert<ResponseForm<RefreshTokenRes>>(res.body);
        });
      const decodedToken = jwtService.decode(refreshTokenRes.result.authTokens.accessToken);
      expect(decodedToken.userRole).toBe('USER');
    });

    it('refresh token이 redis에 저장되어있지 않은 경우', async () => {
      /** pre condition. */
      const payload = {
        userId: 1,
        userRole: 'USER',
      };
      const authorizedRefreshToken = jwtService.sign(payload, {
        secret: appEnv.jwtRefreshTokenSecret,
        expiresIn: appEnv.jwtRefreshTokenExpirationTime,
      });
      /** main test. */
      const refreshTokenRes = await request(app.getHttpServer())
        .post('/user/auth/token')
        .send({ refreshToken: authorizedRefreshToken })
        .then((res) => {
          return typia.assert<AUTH_REFRESH_TOKEN_UNAUTHORIZED>(res.body);
        });
    });

    it('refresh token이 만료된 경우', async () => {
      /** pre condition. */
      const payload = {
        userId: 1,
        userRole: 'USER',
      };
      const authorizedRefreshToken = jwtService.sign(payload, {
        secret: appEnv.jwtRefreshTokenSecret,
        expiresIn: '1ms',
      });
      await redisClient.set(`userId:${payload.userId}:refreshToken`, authorizedRefreshToken);
      await new Promise((resolve) => setTimeout(resolve, 2));
      /** main test. */
      const refreshTokenRes = await request(app.getHttpServer())
        .post('/user/auth/token')
        .send({ refreshToken: authorizedRefreshToken })
        .then((res) => {
          return typia.assert<AUTH_REFRESH_TOKEN_UNAUTHORIZED>(res.body);
        });
    });
  });

  describe('u-1-3 PATCH /user/auth/acquire-admin-role -----------------------------------', () => {
    it('관리자로 등록되어있는 유저의 role을 ADMIN으로 변경성공시.', async () => {
      /** pre condition. */
      const existDummyUser = new UserDummyBuilder()
        .setRole('USER')
        .setSnsId('test-sns-id')
        .setSnsAuthProvider('KAKAO')
        .build();
      await entityEntityManager.save(UserEntity, existDummyUser);
      const existDummyUserAccessToken = jwtService.sign(
        { userId: existDummyUser.id, userRole: existDummyUser.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      /** main test. */
      const acquireAdminRoleRes = await request(app.getHttpServer())
        .patch('/user/auth/acquire-admin-role')
        .set('Authorization', `Bearer ${existDummyUserAccessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<AcquireAdminRoleRes>>(res.body);
        });
      const decodedToken = jwtService.decode(acquireAdminRoleRes.result.authTokens.accessToken);
      expect(decodedToken.userRole).toBe('ADMIN');
    });

    it('등록되지 않은 관리자 계정입니다.', async () => {
      /** pre condition. */
      const unregisteredUser = new UserDummyBuilder()
        .setRole('USER')
        .setSnsId('unregistered-admin-sns-id')
        .setSnsAuthProvider('KAKAO')
        .build();
      await entityEntityManager.save(UserEntity, unregisteredUser);
      const unregisteredUserAccessToken = jwtService.sign(
        { userId: unregisteredUser.id, userRole: unregisteredUser.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      /** main test. */
      const acquireAdminRoleRes = await request(app.getHttpServer())
        .patch('/user/auth/acquire-admin-role')
        .set('Authorization', `Bearer ${unregisteredUserAccessToken}`)
        .then((res) => {
          return typia.assert<AUTH_UNREGISTERED_ADMIN_CREDENTIALS>(res.body);
        });
    });
  });
});
