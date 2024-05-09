import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import typia from 'typia';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import appEnv from '../../src/common/app-env';
import { ResponseForm } from 'src/common/response/response';
import {
  AUTH_REFRESH_TOKEN_UNAUTHORIZED,
  AUTH_UNREGISTERED_ADMIN_CREDENTIALS,
  BusinessException,
  SNS_AUTH_GOOGLE_LOGIN_FAIL,
  SNS_AUTH_KAKAO_LOGIN_FAIL,
  SNS_AUTH_NAVER_LOGIN_FAIL,
  SnsAuthErrors,
} from 'src/common/response/errorResponse';
import { KakaoStrategy } from 'src/modules/sns-auth-client/kakao.strategy';
import { NaverStrategy } from 'src/modules/sns-auth-client/naver.strategy';
import { GoogleStrategy } from 'src/modules/sns-auth-client/google.strategy';
import { DataSource, EntityManager } from 'typeorm';
import { UsersAppService } from 'src/modules/users/application/users.app.service';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { CreateUserReqBody } from 'src/modules/users/presentation/dtos';
import { IValidatedUserData } from 'src/modules/sns-auth-client/interface/validated-user-data.interface';
import { AcquireAdminRoleRes, RefreshTokenRes, SnsLoginReqBody, SnsLoginRes } from 'src/modules/auth/presentation/dtos';
import { ulid } from 'ulid';
import { UserEntity } from 'src/infrastructure/database/entity/user/user.entity';
// import * as Apis from '../../src/api/functional';

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
      const snsAuthProvider = 'KAKAO';
      const existUserEntity = typia.random<Omit<IUser, 'createdAt' | 'updatedAt'>>();
      existUserEntity.id = ulid();
      existUserEntity.birth = '19980101';
      existUserEntity.role = 'USER';
      existUserEntity.snsAuthProvider = snsAuthProvider;
      await entityEntityManager.save(UserEntity, existUserEntity);

      jest.spyOn(kakaoStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret: IValidatedUserData = {
          snsId: existUserEntity.snsId,
          snsAuthProvider: existUserEntity.snsAuthProvider,
          name: existUserEntity.name,
          email: existUserEntity.email,
          phoneNumber: existUserEntity.phoneNumber,
          gender: existUserEntity.gender,
        };
        return ret;
      });

      const SnsLoginReqDto = typia.random<SnsLoginReqBody>();
      SnsLoginReqDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(SnsLoginReqDto);

      expect(typia.is<ResponseForm<SnsLoginRes>>(res.body)).toBe(true);

      const decodedToken = jwtService.decode(res.body.result.authTokens.accessToken);
      expect(decodedToken.userRole).toBe('USER');
    });

    it('KAKAO 신규 유저 로그인 성공 시', async () => {
      const snsAuthProvider = 'KAKAO';
      jest.spyOn(kakaoStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret = typia.random<IValidatedUserData>();
        console.log('ret!!!!!!!!!!!!!!!!!!!!!!', ret);
        ret.snsAuthProvider = snsAuthProvider;
        return ret;
      });

      const SnsLoginReqDto = typia.random<SnsLoginReqBody>();
      SnsLoginReqDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(SnsLoginReqDto);
      console.log('res.body!!!!!!!!!!!!!!!!!!!!!!', res.body);

      expect(typia.is<ResponseForm<SnsLoginRes>>(res.body)).toBe(true);
      const decodedToken = jwtService.decode(res.body.result.authTokens.accessToken);
      expect(decodedToken.userRole).toBe('TEMPORARY_USER');
    });

    it('KAKAO 로그인 실패 시', async () => {
      const snsAuthProvider = 'KAKAO';
      jest.spyOn(kakaoStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        throw new BusinessException(SnsAuthErrors.SNS_AUTH_KAKAO_LOGIN_FAIL, 'test error message');
      });

      const SnsLoginReqDto = typia.random<SnsLoginReqBody>();
      SnsLoginReqDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(SnsLoginReqDto);

      expect(typia.is<SNS_AUTH_KAKAO_LOGIN_FAIL>(res.body)).toBe(true);
    });

    it('NAVER 기존 유저 로그인 성공 시', async () => {
      const snsAuthProvider = 'NAVER';
      const existUserEntity = typia.random<Omit<IUser, 'createdAt' | 'updatedAt'>>();
      existUserEntity.id = ulid();
      existUserEntity.birth = '19980101';
      existUserEntity.role = 'USER';
      existUserEntity.snsAuthProvider = snsAuthProvider;
      await entityEntityManager.save(UserEntity, existUserEntity);

      jest.spyOn(naverStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret: IValidatedUserData = {
          snsId: existUserEntity.snsId,
          snsAuthProvider: existUserEntity.snsAuthProvider,
          name: existUserEntity.name,
          email: existUserEntity.email,
          phoneNumber: existUserEntity.phoneNumber,
          gender: existUserEntity.gender,
        };
        return ret;
      });

      const SnsLoginReqDto = typia.random<SnsLoginReqBody>();
      SnsLoginReqDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(SnsLoginReqDto);

      expect(typia.is<ResponseForm<SnsLoginRes>>(res.body)).toBe(true);

      const decodedToken = jwtService.decode(res.body.result.authTokens.accessToken);
      expect(decodedToken.userRole).toBe('USER');
    });

    it('NAVER 신규 유저 로그인 성공 시', async () => {
      const snsAuthProvider = 'NAVER';
      jest.spyOn(naverStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret = typia.random<IValidatedUserData>();
        ret.snsAuthProvider = snsAuthProvider;
        return ret;
      });

      const SnsLoginReqDto = typia.random<SnsLoginReqBody>();
      SnsLoginReqDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(SnsLoginReqDto);

      expect(typia.is<ResponseForm<SnsLoginRes>>(res.body)).toBe(true);
      const decodedToken = jwtService.decode(res.body.result.authTokens.accessToken);
      expect(decodedToken.userRole).toBe('TEMPORARY_USER');
    });

    it('NAVER 로그인 실패 시', async () => {
      const snsAuthProvider = 'NAVER';
      jest.spyOn(naverStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        throw new BusinessException(SnsAuthErrors.SNS_AUTH_NAVER_LOGIN_FAIL, 'test error message');
      });

      const SnsLoginReqDto = typia.random<SnsLoginReqBody>();
      SnsLoginReqDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(SnsLoginReqDto);

      expect(typia.is<SNS_AUTH_NAVER_LOGIN_FAIL>(res.body)).toBe(true);
    });

    it('GOOGLE 기존 유저 로그인 성공 시', async () => {
      const snsAuthProvider = 'GOOGLE';
      const existUserEntity = typia.random<Omit<IUser, 'createdAt' | 'updatedAt'>>();
      existUserEntity.id = ulid();
      existUserEntity.birth = '19980101';
      existUserEntity.role = 'USER';
      existUserEntity.snsAuthProvider = snsAuthProvider;
      await entityEntityManager.save(UserEntity, existUserEntity);

      jest.spyOn(googleStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret: IValidatedUserData = {
          snsId: existUserEntity.snsId,
          snsAuthProvider: existUserEntity.snsAuthProvider,
          name: existUserEntity.name,
          email: existUserEntity.email,
        };
        return ret;
      });

      const SnsLoginReqDto = typia.random<SnsLoginReqBody>();
      SnsLoginReqDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(SnsLoginReqDto);

      expect(typia.is<ResponseForm<SnsLoginRes>>(res.body)).toBe(true);

      const decodedToken = jwtService.decode(res.body.result.authTokens.accessToken);
      expect(decodedToken.userRole).toBe('USER');
    });

    it('GOOGLE 신규 유저 로그인 성공 시', async () => {
      const snsAuthProvider = 'GOOGLE';
      jest.spyOn(googleStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret = typia.random<CreateUserReqBody>();
        ret.snsAuthProvider = snsAuthProvider;
        return ret;
      });

      const SnsLoginReqDto = typia.random<SnsLoginReqBody>();
      SnsLoginReqDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(SnsLoginReqDto);

      expect(typia.is<ResponseForm<SnsLoginRes>>(res.body)).toBe(true);
      const decodedToken = jwtService.decode(res.body.result.authTokens.accessToken);
      expect(decodedToken.userRole).toBe('TEMPORARY_USER');
    });

    it('GOOGLE 로그인 실패 시', async () => {
      const snsAuthProvider = 'GOOGLE';
      jest.spyOn(googleStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        throw new BusinessException(SnsAuthErrors.SNS_AUTH_GOOGLE_LOGIN_FAIL, 'test error message');
      });

      const SnsLoginReqDto = typia.random<SnsLoginReqBody>();
      SnsLoginReqDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(SnsLoginReqDto);

      expect(typia.is<SNS_AUTH_GOOGLE_LOGIN_FAIL>(res.body)).toBe(true);
    });
  });

  describe('u-1-2 POST /user/auth/token -------------------------------------------------', () => {
    it('refresh token이 유효한 경우', async () => {
      const payload = {
        userId: 1,
        userRole: 'USER',
      };
      const authorizedRefreshToken = jwtService.sign(payload, {
        secret: appEnv.jwtRefreshTokenSecret,
        expiresIn: appEnv.jwtRefreshTokenExpirationTime,
      });

      await redisClient.set(`userId:${payload.userId}:refreshToken`, authorizedRefreshToken);

      const res = await request(app.getHttpServer())
        .post('/user/auth/token')
        .send({ refreshToken: authorizedRefreshToken });

      expect(typia.is<ResponseForm<RefreshTokenRes>>(res.body)).toBe(true);
      const decodedToken = jwtService.decode(res.body.result.authTokens.accessToken);
      expect(decodedToken.userRole).toBe('USER');
    });

    it('refresh token이 redis에 저장되어있지 않은 경우', async () => {
      const payload = {
        userId: 1,
        userRole: 'USER',
      };
      const authorizedRefreshToken = jwtService.sign(payload, {
        secret: appEnv.jwtRefreshTokenSecret,
        expiresIn: appEnv.jwtRefreshTokenExpirationTime,
      });

      const res = await request(app.getHttpServer())
        .post('/user/auth/token')
        .send({ refreshToken: authorizedRefreshToken });

      expect(typia.is<AUTH_REFRESH_TOKEN_UNAUTHORIZED>(res.body)).toBe(true);
    });

    it('refresh token이 만료된 경우', async () => {
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
      const res = await request(app.getHttpServer())
        .post('/user/auth/token')
        .send({ refreshToken: authorizedRefreshToken });

      expect(typia.is<AUTH_REFRESH_TOKEN_UNAUTHORIZED>(res.body)).toBe(true);
    });
  });

  describe('u-1-3 PATCH /user/auth/acquire-admin-role -----------------------------------', () => {
    it('관리자로 등록되어있는 유저를 관리자 역할로 변경합니다.', async () => {
      const existUserEntity = typia.random<Omit<IUser, 'createdAt' | 'updatedAt'>>();
      existUserEntity.id = ulid();
      existUserEntity.birth = '19980101';
      existUserEntity.role = 'USER';
      existUserEntity.snsId = 'test-sns-id';
      existUserEntity.snsAuthProvider = 'KAKAO';
      await entityEntityManager.save(UserEntity, existUserEntity);

      const res = await request(app.getHttpServer())
        .patch('/user/auth/acquire-admin-role')
        .set(
          'Authorization',
          `Bearer ${jwtService.sign(
            { userId: existUserEntity.id, userRole: 'USER' },
            { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
          )}`,
        );

      expect(typia.is<ResponseForm<AcquireAdminRoleRes>>(res.body)).toBe(true);
      const decodedToken = jwtService.decode(res.body.result.authTokens.accessToken);
      expect(decodedToken.userRole).toBe('ADMIN');
    });

    it('등록되지 않은 관리자 계정입니다.', async () => {
      const user = typia.random<IUser>();
      user.snsId = 'unregistered-admin-sns-id';
      user.snsAuthProvider = 'KAKAO';
      user.role = 'USER';
      user.birth = '19980101';
      await entityEntityManager.save(UserEntity, user);

      const res = await request(app.getHttpServer())
        .patch('/user/auth/acquire-admin-role')
        .set(
          'Authorization',
          `Bearer ${jwtService.sign(
            { userId: user.id, userRole: 'USER' },
            { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
          )}`,
        );

      expect(typia.is<AUTH_UNREGISTERED_ADMIN_CREDENTIALS>(res.body)).toBe(true);
    });
  });
});
