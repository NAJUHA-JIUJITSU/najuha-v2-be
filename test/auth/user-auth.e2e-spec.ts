import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import typia from 'typia';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { SnsAuthDto } from '../../src/sns-auth/dto/sns-auth.dto';
import appConfig from '../../src/common/appConfig';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ResponseForm } from 'src/common/response/response';
import { AuthTokensDto } from 'src/auth/dto/auth-tokens.dto';
import {
  AUTH_REFRESH_TOKEN_UNAUTHORIZED,
  AUTH_UNREGISTERED_ADMIN_CREDENTIALS,
  BusinessException,
  SNS_AUTH_GOOGLE_LOGIN_FAIL,
  SNS_AUTH_KAKAO_LOGIN_FAIL,
  SNS_AUTH_NAVER_LOGIN_FAIL,
  SnsAuthErrorMap,
} from 'src/common/response/errorResponse';
import { KakaoStrategy } from 'src/sns-auth/kakao.strategy';
import { NaverStrategy } from 'src/sns-auth/naver.strategy';
import { GoogleStrategy } from 'src/sns-auth/google.strategy';
import { DataSource, QueryRunner } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
// import * as Apis from '../../src/api/functional';

describe('E2E u-1 user-auth test', () => {
  let app: INestApplication;
  let testingModule: TestingModule;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;
  let redisClient: Redis;
  let jwtService: JwtService;
  let userService: UsersService;
  let kakaoStrategy: KakaoStrategy;
  let naverStrategy: NaverStrategy;
  let googleStrategy: GoogleStrategy;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    dataSource = testingModule.get<DataSource>(DataSource);
    redisClient = testingModule.get<Redis>('REDIS_CLIENT');
    jwtService = testingModule.get<JwtService>(JwtService);
    userService = testingModule.get<UsersService>(UsersService);
    kakaoStrategy = testingModule.get<KakaoStrategy>(KakaoStrategy);
    naverStrategy = testingModule.get<NaverStrategy>(NaverStrategy);
    googleStrategy = testingModule.get<GoogleStrategy>(GoogleStrategy);
    (await app.init()).listen(appConfig.appPort);
  });

  beforeEach(async () => {
    queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
    await queryRunner.release();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('u-1-1 POST /user/auth/sns-login ------------------------------------------', () => {
    it('기존 유저 KAKAO 로그인 성공 시', async () => {
      const snsAuthProvider = 'KAKAO';
      const user = typia.random<CreateUserDto>();
      user.snsAuthProvider = snsAuthProvider;

      const userEntity = await userService.createUser(user);
      await userService.updateUser(userEntity.id, { role: 'USER' });

      jest.spyOn(kakaoStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret: CreateUserDto = {
          snsId: userEntity.snsId,
          snsAuthProvider: userEntity.snsAuthProvider,
          name: userEntity.name,
          email: userEntity.email,
          phoneNumber: userEntity.phoneNumber,
          gender: userEntity.gender,
        };
        return ret;
      });

      const snsAuthDto = typia.random<SnsAuthDto>();
      snsAuthDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(snsAuthDto);

      expect(typia.is<ResponseForm<AuthTokensDto>>(res.body)).toBe(true);

      const decodedToken = jwtService.decode(res.body.data.accessToken);
      expect(decodedToken.userRole).toBe('USER');
    });

    it('신규 유저 KAKAO 로그인 성공 시', async () => {
      const snsAuthProvider = 'KAKAO';
      jest.spyOn(kakaoStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret = typia.random<CreateUserDto>();
        ret.snsAuthProvider = snsAuthProvider;
        return ret;
      });

      const snsAuthDto = typia.random<SnsAuthDto>();
      snsAuthDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(snsAuthDto);

      expect(typia.is<ResponseForm<AuthTokensDto>>(res.body)).toBe(true);
      const decodedToken = jwtService.decode(res.body.data.accessToken);
      expect(decodedToken.userRole).toBe('TEMPORARY_USER');
    });

    it('KAKAO 로그인 실패 시', async () => {
      const snsAuthProvider = 'KAKAO';
      jest.spyOn(kakaoStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        throw new BusinessException(SnsAuthErrorMap.SNS_AUTH_KAKAO_LOGIN_FAIL, 'test error message');
      });

      const snsAuthDto = typia.random<SnsAuthDto>();
      snsAuthDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(snsAuthDto);

      expect(typia.is<SNS_AUTH_KAKAO_LOGIN_FAIL>(res.body)).toBe(true);
    });

    it('기존 유저 NAVER 로그인 성공 시', async () => {
      const snsAuthProvider = 'NAVER';
      const user = typia.random<CreateUserDto>();
      user.snsAuthProvider = snsAuthProvider;

      let userEntity = await userService.createUser(user);
      await userService.updateUser(userEntity.id, { role: 'USER' });

      jest.spyOn(naverStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret: CreateUserDto = {
          snsId: userEntity.snsId,
          snsAuthProvider: userEntity.snsAuthProvider,
          name: userEntity.name,
          email: userEntity.email,
          phoneNumber: userEntity.phoneNumber,
          gender: userEntity.gender,
        };
        return ret;
      });

      const snsAuthDto: SnsAuthDto = {
        snsAuthCode: 'test-sns-auth-code',
        snsAuthProvider: snsAuthProvider,
      };

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(snsAuthDto);

      expect(typia.is<ResponseForm<AuthTokensDto>>(res.body)).toBe(true);

      const decodedToken = jwtService.decode(res.body.data.accessToken);
      expect(decodedToken.userRole).toBe('USER');
    });

    it('신규 유저 NAVER 로그인 성공 시', async () => {
      const snsAuthProvider = 'NAVER';
      jest.spyOn(naverStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret = typia.random<CreateUserDto>();
        ret.snsAuthProvider = snsAuthProvider;
        return ret;
      });

      const snsAuthDto = typia.random<SnsAuthDto>();
      snsAuthDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(snsAuthDto);

      expect(typia.is<ResponseForm<AuthTokensDto>>(res.body)).toBe(true);
      const decodedToken = jwtService.decode(res.body.data.accessToken);
      expect(decodedToken.userRole).toBe('TEMPORARY_USER');
    });

    it('NAVER 로그인 실패 시', async () => {
      const snsAuthProvider = 'NAVER';
      jest.spyOn(naverStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        throw new BusinessException(SnsAuthErrorMap.SNS_AUTH_NAVER_LOGIN_FAIL, 'test error message');
      });

      const snsAuthDto = typia.random<SnsAuthDto>();
      snsAuthDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(snsAuthDto);

      expect(typia.is<SNS_AUTH_NAVER_LOGIN_FAIL>(res.body)).toBe(true);
    });

    it('기존 유저 GOOGLE 로그인 성공 시', async () => {
      const snsAuthProvider = 'GOOGLE';
      const user = typia.random<CreateUserDto>();
      user.snsAuthProvider = snsAuthProvider;

      const userEntity = await userService.createUser(user);
      await userService.updateUser(userEntity.id, { role: 'USER' });

      jest.spyOn(googleStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret: CreateUserDto = {
          snsId: userEntity.snsId,
          snsAuthProvider: userEntity.snsAuthProvider,
          name: userEntity.name,
          email: userEntity.email,
          phoneNumber: userEntity.phoneNumber,
          gender: userEntity.gender,
        };
        return ret;
      });

      const snsAuthDto = typia.random<SnsAuthDto>();
      snsAuthDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(snsAuthDto);

      expect(typia.is<ResponseForm<AuthTokensDto>>(res.body)).toBe(true);

      const decodedToken = jwtService.decode(res.body.data.accessToken);
      expect(decodedToken.userRole).toBe('USER');
    });

    it('신규 유저 GOOGLE 로그인 성공 시', async () => {
      const snsAuthProvider = 'GOOGLE';
      jest.spyOn(googleStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        const ret = typia.random<CreateUserDto>();
        ret.snsAuthProvider = snsAuthProvider;
        return ret;
      });

      const snsAuthDto = typia.random<SnsAuthDto>();
      snsAuthDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(snsAuthDto);

      expect(typia.is<ResponseForm<AuthTokensDto>>(res.body)).toBe(true);
      const decodedToken = jwtService.decode(res.body.data.accessToken);
      expect(decodedToken.userRole).toBe('TEMPORARY_USER');
    });

    it('GOOGLE 로그인 실패 시', async () => {
      const snsAuthProvider = 'GOOGLE';
      jest.spyOn(googleStrategy, 'validate').mockImplementation(async (snsAuthCode: string) => {
        throw new BusinessException(SnsAuthErrorMap.SNS_AUTH_GOOGLE_LOGIN_FAIL, 'test error message');
      });

      const snsAuthDto = typia.random<SnsAuthDto>();
      snsAuthDto.snsAuthProvider = snsAuthProvider;

      const res = await request(app.getHttpServer()).post('/user/auth/sns-login').send(snsAuthDto);

      expect(typia.is<SNS_AUTH_GOOGLE_LOGIN_FAIL>(res.body)).toBe(true);
    });
  });

  describe('u-1-2 POST /user/auth/token -------------------------------------------------', () => {
    afterEach(async () => {
      await redisClient.flushall();
    });

    it('refresh token이 유효한 경우', async () => {
      const payload = {
        userId: 1,
        userRole: 'USER',
      };
      const authorizedRefreshToken = jwtService.sign(payload, {
        secret: appConfig.jwtRefreshTokenSecret,
        expiresIn: appConfig.jwtRefreshTokenExpirationTime,
      });

      await redisClient.set(`userId:${payload.userId}:refreshToken`, authorizedRefreshToken);

      const res = await request(app.getHttpServer())
        .post('/user/auth/token')
        .send({ refreshToken: authorizedRefreshToken });

      expect(typia.is<ResponseForm<AuthTokensDto>>(res.body)).toBe(true);
      const decodedToken = jwtService.decode(res.body.data.accessToken);
      expect(decodedToken.userRole).toBe('USER');
    });

    it('refresh token이 redis에 저장되어있지 않은 경우', async () => {
      const payload = {
        userId: 1,
        userRole: 'USER',
      };
      const authorizedRefreshToken = jwtService.sign(payload, {
        secret: appConfig.jwtRefreshTokenSecret,
        expiresIn: appConfig.jwtRefreshTokenExpirationTime,
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
        secret: appConfig.jwtRefreshTokenSecret,
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
    afterEach(async () => {
      await redisClient.flushall();
    });

    it('관리자로 등록되어있는 유저를 관리자 역할로 변경합니다.', async () => {
      const user = typia.random<CreateUserDto>();
      user.snsId = 'test-sns-id';
      user.snsAuthProvider = 'KAKAO';
      const userEntity = await userService.createUser(user);

      const res = await request(app.getHttpServer())
        .patch('/user/auth/acquire-admin-role')
        .set(
          'Authorization',
          `Bearer ${jwtService.sign(
            { userId: userEntity.id, userRole: 'USER' },
            { secret: appConfig.jwtAccessTokenSecret, expiresIn: appConfig.jwtAccessTokenExpirationTime },
          )}`,
        );

      expect(typia.is<ResponseForm<AuthTokensDto>>(res.body)).toBe(true);
      const decodedToken = jwtService.decode(res.body.data.accessToken);
      expect(decodedToken.userRole).toBe('ADMIN');
    });

    it('등록되지 않은 관리자 계정입니다.', async () => {
      const user = typia.random<CreateUserDto>();
      user.snsId = 'unregistered-admin-sns-id';
      user.snsAuthProvider = 'KAKAO';
      const userEntity = await userService.createUser(user);

      const res = await request(app.getHttpServer())
        .patch('/user/auth/acquire-admin-role')
        .set(
          'Authorization',
          `Bearer ${jwtService.sign(
            { userId: userEntity.id, userRole: 'USER' },
            { secret: appConfig.jwtAccessTokenSecret, expiresIn: appConfig.jwtAccessTokenExpirationTime },
          )}`,
        );

      expect(typia.is<AUTH_UNREGISTERED_ADMIN_CREDENTIALS>(res.body)).toBe(true);
    });
  });
});
