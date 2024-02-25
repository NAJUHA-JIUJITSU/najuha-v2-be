import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { KakaoUserResponseData } from 'src/sns-auth/types/kakao-user-data.type';
import * as request from 'supertest';
import { Repository, EntityManager } from 'typeorm';

import { AppModule } from '../../src/app.module';
import { AuthService } from '../../src/auth/auth.service';
import { ExpectedError } from '../../src/common/response/errorResponse';
import { UserEntity } from '../../src/users/entities/user.entity';

const mockedKakaoUserResponseData: KakaoUserResponseData = {
  id: 'mocked-user-id',
  connected_at: 'mocked-connected-at',
  properties: {
    nickname: 'mocked-nickname',
    profile_image: 'mocked-profile-image',
    thumbnail_image: 'mocked-thumbnail-image',
  },
  kakao_account: {
    profile_nickname_needs_agreement: false,
    profile_image_needs_agreement: false,
    profile: {
      nickname: 'mocked-profile-nickname',
      thumbnail_image_url: 'mocked-thumbnail-image-url',
      profile_image_url: 'mocked-profile-image-url',
      is_default_image: false,
    },
    name_needs_agreement: false,
    name: 'mocked-name',
    has_email: true,
    email_needs_agreement: false,
    is_email_valid: true,
    is_email_verified: true,
    email: 'mocked-email@example.com',
    has_phone_number: true,
    phone_number_needs_agreement: false,
    phone_number: 'mocked-phone-number',
    has_birthyear: true,
    birthyear_needs_agreement: false,
    birthyear: 'mocked-birthyear',
    has_birthday: true,
    birthday_needs_agreement: false,
    birthday: 'mocked-birthday',
    birthday_type: 'mocked-birthday-type',
    has_gender: true,
    gender_needs_agreement: false,
    gender: 'mocked-gender',
  },
};

describe('AuthService (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let moduleFixture: TestingModule;
  let entityManager: EntityManager;
  let userRepository: Repository<UserEntity>;

  // 테스트 환경 설정
  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    entityManager = moduleFixture.get<EntityManager>(EntityManager);
    userRepository = moduleFixture.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  // 각 테스트 후에 데이터베이스 초기화
  afterEach(async () => {
    await entityManager.clear(UserEntity);
  });

  // 테스트 후 정리
  afterAll(async () => {
    await app.close();
  });

  // Kakao 유저 정보 모킹을 위한 함수
  const mockKakaoUser = (data: KakaoUserResponseData = mockedKakaoUserResponseData) => {
    jest.spyOn(authService as any, 'getKakaoAccessToken').mockResolvedValue('mocked-access-token');
    jest.spyOn(authService as any, 'getKakaoUserData').mockResolvedValue(data);
  };

  // 특정 상황에서 유저가 존재하는지 검증하는 함수
  const assertUserExists = async () => {
    const user = await userRepository.findOne({
      where: { snsId: 'mocked-user-id', snsProvider: 'KAKAO' },
    });

    expect(user).toBeDefined();
    expect(user!.snsId).toBe('mocked-user-id');
    expect(user!.snsProvider).toBe('KAKAO');
  };

  // 특정 상황에서 에러 응답을 검증하는 함수
  const assertErrorResponse = async (
    response: request.Response,
    expectedStatus: number,
    errorCode?: number,
    errorMessage?: string,
  ) => {
    expect(response.status).toBe(expectedStatus);
    if (errorCode !== undefined) {
      expect(response.body.code).toBe(errorCode);
    }
    if (errorMessage !== undefined) {
      expect(response.body.data).toBe(errorMessage);
    }
  };

  // 테스트 케이스 1: 존재하지 않는 유저인 경우 새로 생성
  it('/auth/kakao (POST) - 존재하지 않는 유저일 경우 생성하고 응답 확인', async () => {
    mockKakaoUser();

    const response = await request(app.getHttpServer()).post('/auth/kakao').send({ snsAuthCode: 'mocked-auth-code' });

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();

    await assertUserExists();
  });

  // 테스트 케이스 2: 이미 존재하는 유저인 경우 생성하지 않고 토큰만 반환
  it('/auth/kakao (POST) - 이미 존재하는 유저일 경우 토큰만 반환하고 응답 확인', async () => {
    // 이미 존재하는 유저를 테스트 데이터베이스에 추가
    await userRepository.save({
      snsId: 'mocked-user-id',
      snsProvider: 'KAKAO',
      name: 'Mocked User',
      email: 'mocked-user@example.com',
      phoneNumber: '123-456-7890',
      gender: 'MALE',
    });

    mockKakaoUser();

    const response = await request(app.getHttpServer()).post('/auth/kakao').send({ snsAuthCode: 'mocked-auth-code' });

    expect(response.status).toBe(201);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();

    // userRepository에 새로운 유저가 추가되지 않았음을 확인
    const usersAfterTest = await userRepository.find();
    expect(usersAfterTest.length).toBe(1);
  });

  // 테스트 케이스 3: 유효하지 않은 Kakao 인증 코드로 인증 시도
  it('/auth/kakao (POST) - 유효하지 않은 인증 코드로 INTERNAL_SERVER_ERROR 응답 확인', async () => {
    jest.spyOn(authService as any, 'getKakaoAccessToken').mockResolvedValue('mocked-access-token');
    jest.spyOn(authService as any, 'getKakaoUserData').mockRejectedValue(new Error('Invalid snsAuthCode'));

    const response = await request(app.getHttpServer()).post('/auth/kakao').send({ snsAuthCode: 'invalid-auth-code' });

    await assertErrorResponse(response, HttpStatus.INTERNAL_SERVER_ERROR);
  });

  // 테스트 케이스 4: Kakao 유저 정보 가져오기 실패로 INTERNAL_SERVER_ERROR 응답 확인
  it('/auth/kakao (POST) - Kakao 유저 정보 가져오기 실패로 INTERNAL_SERVER_ERROR 응답 확인', async () => {
    mockKakaoUser();
    jest.spyOn(authService as any, 'getKakaoUserData').mockRejectedValue(new ExpectedError('KAKAO_USER_INFO_ERROR'));

    const response = await request(app.getHttpServer()).post('/auth/kakao').send({ snsAuthCode: 'valid-auth-code' });

    await assertErrorResponse(
      response,
      HttpStatus.INTERNAL_SERVER_ERROR,
      5001,
      '카카오 사용자 정보를 가져오는 중 오류가 발생했습니다.',
    );
  });
});
