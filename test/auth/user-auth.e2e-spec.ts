import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import typia from 'typia';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { SnsLoginReqDto } from '../../src/modules/auth/dto/request/sns-login.dto';
import appEnv from '../../src/common/app-env';
import { CreateUserReqDto } from 'src/modules/users/dto/request/create-user.req.dto';
import { ResponseForm } from 'src/common/response/response';
import { AuthTokensResDto } from 'src/modules/auth/dto/response/auth-tokens.res.dto';
import {
  AUTH_REFRESH_TOKEN_UNAUTHORIZED,
  AUTH_UNREGISTERED_ADMIN_CREDENTIALS,
  BusinessException,
  SNS_AUTH_GOOGLE_LOGIN_FAIL,
  SNS_AUTH_KAKAO_LOGIN_FAIL,
  SNS_AUTH_NAVER_LOGIN_FAIL,
  SnsAuthErrorMap,
} from 'src/common/response/errorResponse';
import { KakaoStrategy } from 'src/infrastructure/sns-auth-client/kakao.strategy';
import { NaverStrategy } from 'src/infrastructure/sns-auth-client/naver.strategy';
import { GoogleStrategy } from 'src/infrastructure/sns-auth-client/google.strategy';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { UsersAppService } from 'src/modules/users/application/users.app.service';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import { UserEntity } from 'src/modules/users/domain/user.entity';
// import * as Apis from '../../src/api/functional';

describe('E2E u-1 user-auth test', () => {
  let app: INestApplication;
  let testingModule: TestingModule;
  let dataSource: DataSource;
  let entityManager: EntityManager;
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
    entityManager = testingModule.get<EntityManager>(EntityManager);
    tableNames = entityManager.connection.entityMetadatas.map((entity) => `"${entity.tableName}"`).join(', ');
    redisClient = testingModule.get<Redis>('REDIS_CLIENT');
    jwtService = testingModule.get<JwtService>(JwtService);
    userService = testingModule.get<UsersAppService>(UsersAppService);
    kakaoStrategy = testingModule.get<KakaoStrategy>(KakaoStrategy);
    naverStrategy = testingModule.get<NaverStrategy>(NaverStrategy);
    googleStrategy = testingModule.get<GoogleStrategy>(GoogleStrategy);
    (await app.init()).listen(appEnv.appPort);
  });

  afterEach(async () => {
    await entityManager.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`);
    await redisClient.flushall();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('u-1-1 POST /user/auth/sns-login ------------------------------------------', () => {
    it('기존 유저 KAKAO 로그인 성공 시', async () => {
      const snsAuthProvider = 'KAKAO';
      const existUserDto = typia.random<Omit<UserEntity, 'createdAt' | 'updatedAt' | 'id'>>();
      existUserDto.role = 'USER';
      existUserDto.birth = '19980101';
      existUserDto.snsAuthProvider = snsAuthProvider;
      const existUser = await userService.createUser(existUserDto);

      jest.spyOn(kakaoStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret: CreateUserReqDto = {
          snsId: existUser.snsId,
          snsAuthProvider: existUser.snsAuthProvider,
          name: existUser.name,
          email: existUser.email,
          phoneNumber: existUser.phoneNumber,
          gender: existUser.gender,
        };
        return ret;
      });

      const SnsLoginReqDto = typia.random<SnsLoginReqDto>();
      SnsLoginReqDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(SnsLoginReqDto);

      expect(typia.is<ResponseForm<AuthTokensResDto>>(res.body)).toBe(true);

      const decodedToken = jwtService.decode(res.body.result.accessToken);
      expect(decodedToken.userRole).toBe('USER');
    });

    it('신규 유저 KAKAO 로그인 성공 시', async () => {
      const snsAuthProvider = 'KAKAO';
      jest.spyOn(kakaoStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret = typia.random<CreateUserReqDto>();
        ret.snsAuthProvider = snsAuthProvider;
        return ret;
      });

      const SnsLoginReqDto = typia.random<SnsLoginReqDto>();
      SnsLoginReqDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(SnsLoginReqDto);

      expect(typia.is<ResponseForm<AuthTokensResDto>>(res.body)).toBe(true);
      const decodedToken = jwtService.decode(res.body.result.accessToken);
      expect(decodedToken.userRole).toBe('TEMPORARY_USER');
    });

    it('KAKAO 로그인 실패 시', async () => {
      const snsAuthProvider = 'KAKAO';
      jest.spyOn(kakaoStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        throw new BusinessException(SnsAuthErrorMap.SNS_AUTH_KAKAO_LOGIN_FAIL, 'test error message');
      });

      const SnsLoginReqDto = typia.random<SnsLoginReqDto>();
      SnsLoginReqDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(SnsLoginReqDto);

      expect(typia.is<SNS_AUTH_KAKAO_LOGIN_FAIL>(res.body)).toBe(true);
    });

    it('기존 유저 NAVER 로그인 성공 시', async () => {
      const snsAuthProvider = 'NAVER';
      const existUserDto = typia.random<Omit<UserEntity, 'createdAt' | 'updatedAt' | 'id'>>();
      existUserDto.role = 'USER';
      existUserDto.birth = '19980101';
      existUserDto.snsAuthProvider = snsAuthProvider;
      const existUser = await userService.createUser(existUserDto);

      jest.spyOn(naverStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret: CreateUserReqDto = {
          snsId: existUser.snsId,
          snsAuthProvider: existUser.snsAuthProvider,
          name: existUser.name,
          email: existUser.email,
          phoneNumber: existUser.phoneNumber,
          gender: existUser.gender,
        };
        return ret;
      });

      const SnsLoginReqDto = typia.random<SnsLoginReqDto>();
      SnsLoginReqDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(SnsLoginReqDto);

      expect(typia.is<ResponseForm<AuthTokensResDto>>(res.body)).toBe(true);

      const decodedToken = jwtService.decode(res.body.result.accessToken);
      expect(decodedToken.userRole).toBe('USER');
    });

    it('신규 유저 NAVER 로그인 성공 시', async () => {
      const snsAuthProvider = 'NAVER';
      jest.spyOn(naverStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret = typia.random<CreateUserReqDto>();
        ret.snsAuthProvider = snsAuthProvider;
        return ret;
      });

      const SnsLoginReqDto = typia.random<SnsLoginReqDto>();
      SnsLoginReqDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(SnsLoginReqDto);

      expect(typia.is<ResponseForm<AuthTokensResDto>>(res.body)).toBe(true);
      const decodedToken = jwtService.decode(res.body.result.accessToken);
      expect(decodedToken.userRole).toBe('TEMPORARY_USER');
    });

    it('NAVER 로그인 실패 시', async () => {
      const snsAuthProvider = 'NAVER';
      jest.spyOn(naverStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        throw new BusinessException(SnsAuthErrorMap.SNS_AUTH_NAVER_LOGIN_FAIL, 'test error message');
      });

      const SnsLoginReqDto = typia.random<SnsLoginReqDto>();
      SnsLoginReqDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(SnsLoginReqDto);

      expect(typia.is<SNS_AUTH_NAVER_LOGIN_FAIL>(res.body)).toBe(true);
    });

    it('기존 유저 GOOGLE 로그인 성공 시', async () => {
      const snsAuthProvider = 'GOOGLE';
      const existUserDto = typia.random<Omit<UserEntity, 'createdAt' | 'updatedAt' | 'id'>>();
      existUserDto.role = 'USER';
      existUserDto.birth = '19980101';
      existUserDto.snsAuthProvider = snsAuthProvider;
      const exiDtostUser = await userService.createUser(existUserDto);

      jest.spyOn(googleStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret: CreateUserReqDto = {
          snsId: exiDtostUser.snsId,
          snsAuthProvider: exiDtostUser.snsAuthProvider,
          name: exiDtostUser.name,
          email: exiDtostUser.email,
        };
        return ret;
      });

      const SnsLoginReqDto = typia.random<SnsLoginReqDto>();
      SnsLoginReqDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(SnsLoginReqDto);

      expect(typia.is<ResponseForm<AuthTokensResDto>>(res.body)).toBe(true);

      const decodedToken = jwtService.decode(res.body.result.accessToken);
      expect(decodedToken.userRole).toBe('USER');
    });

    it('신규 유저 GOOGLE 로그인 성공 시', async () => {
      const snsAuthProvider = 'GOOGLE';
      jest.spyOn(googleStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret = typia.random<CreateUserReqDto>();
        ret.snsAuthProvider = snsAuthProvider;
        return ret;
      });

      const SnsLoginReqDto = typia.random<SnsLoginReqDto>();
      SnsLoginReqDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(SnsLoginReqDto);

      expect(typia.is<ResponseForm<AuthTokensResDto>>(res.body)).toBe(true);
      const decodedToken = jwtService.decode(res.body.result.accessToken);
      expect(decodedToken.userRole).toBe('TEMPORARY_USER');
    });

    it('GOOGLE 로그인 실패 시', async () => {
      const snsAuthProvider = 'GOOGLE';
      jest.spyOn(googleStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        throw new BusinessException(SnsAuthErrorMap.SNS_AUTH_GOOGLE_LOGIN_FAIL, 'test error message');
      });

      const SnsLoginReqDto = typia.random<SnsLoginReqDto>();
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

      expect(typia.is<ResponseForm<AuthTokensResDto>>(res.body)).toBe(true);
      const decodedToken = jwtService.decode(res.body.result.accessToken);
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
      const user = typia.random<CreateUserReqDto>();
      user.snsId = 'test-sns-id';
      user.snsAuthProvider = 'KAKAO';
      const userEntity = await userService.createUser(user);

      const res = await request(app.getHttpServer())
        .patch('/user/auth/acquire-admin-role')
        .set(
          'Authorization',
          `Bearer ${jwtService.sign(
            { userId: userEntity.id, userRole: 'USER' },
            { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
          )}`,
        );

      expect(typia.is<ResponseForm<AuthTokensResDto>>(res.body)).toBe(true);
      const decodedToken = jwtService.decode(res.body.result.accessToken);
      expect(decodedToken.userRole).toBe('ADMIN');
    });

    it('등록되지 않은 관리자 계정입니다.', async () => {
      const user = typia.random<CreateUserReqDto>();
      user.snsId = 'unregistered-admin-sns-id';
      user.snsAuthProvider = 'KAKAO';
      const userEntity = await userService.createUser(user);

      const res = await request(app.getHttpServer())
        .patch('/user/auth/acquire-admin-role')
        .set(
          'Authorization',
          `Bearer ${jwtService.sign(
            { userId: userEntity.id, userRole: 'USER' },
            { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
          )}`,
        );

      expect(typia.is<AUTH_UNREGISTERED_ADMIN_CREDENTIALS>(res.body)).toBe(true);
    });
  });
});
