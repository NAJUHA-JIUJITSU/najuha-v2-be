import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { KakaoUserResponseData } from '../src/auth/types/kakao-user-response-data.type';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';

const mockedKakaoUserInfo: KakaoUserResponseData = {
  id: '111',
  connected_at: '2023-01-01T00:00:00Z',
  properties: {
    nickname: 'Mocked User',
    profile_image: 'https://mocked.url/profile.jpg',
    thumbnail_image: 'https://mocked.url/thumbnail.jpg',
  },
  kakao_account: {
    profile_nickname_needs_agreement: false,
    profile_image_needs_agreement: false,
    profile: {
      nickname: 'Mocked User',
      thumbnail_image_url: 'https://mocked.url/thumbnail.jpg',
      profile_image_url: 'https://mocked.url/profile.jpg',
      is_default_image: false,
    },
    name_needs_agreement: false,
    name: 'Mocked User',
    has_email: true,
    email_needs_agreement: false,
    is_email_valid: true,
    is_email_verified: true,
    email: 'mocked@user.com',
    has_phone_number: true,
    phone_number_needs_agreement: false,
    phone_number: '+821000000000',
    has_birthyear: true,
    birthyear_needs_agreement: false,
    birthyear: '1990',
    has_birthday: true,
    birthday_needs_agreement: false,
    birthday: '0101',
    birthday_type: 'SOLAR',
    has_gender: true,
    gender_needs_agreement: false,
    gender: 'male',
  },
};

// jest.mock('../src/auth/auth.service', () => {
//   return {
//     AuthService: jest.fn().mockImplementation(() => {
//       return {
//         getKakaoAccessToken: jest.fn().mockResolvedValue('mocked-access-token'),
//         getKakaoUserInfo: jest.fn().mockResolvedValue(mockedKakaoUserInfo),
//         // findUserBySnsIdaAndSnsProvider: jest.requireActual(
//         //   '../src/users/users.service',
//         // ).UsersService.prototype.findUserBySnsIdaAndSnsProvider,
//         // createUser: jest.requireActual('../src/users/users.service')
//         //   .UsersService.prototype.createUser,
//         // createAccessToken: jest.requireActual('../src/auth/auth.service')
//         //   .AuthService.prototype.createAccessToken,
//         // createRefreshToken: jest.requireActual('../src/auth/auth.service')
//         //   .AuthService.prototype.createRefreshToken,

//         kakaoLogin: jest.requireActual('../src/auth/auth.service').AuthService
//           .prototype.kakaoLogin,
//       };
//     }),
//   };
// });

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let moduleFixture: TestingModule;
  let usersService: UsersService;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    usersService = moduleFixture.get<UsersService>(UsersService);
  });

  it('/auth/kakao (POST)', async () => {
    const dto = { snsAuthCode: 'dummy-code' };

    jest
      .spyOn(authService as any, 'getKakaoAccessToken')
      .mockResolvedValue('mocked-access-token');

    jest
      .spyOn(authService as any, 'getKakaoUserInfo')
      .mockResolvedValue(mockedKakaoUserInfo);

    const response = await request(app.getHttpServer())
      .post('/auth/kakao')
      .send(dto)
      .expect(201); // or the expected status code
    console.log(response.body);
    expect(response.body).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });

    const user = await usersService.findUserBySnsIdaAndSnsProvider(
      mockedKakaoUserInfo.id,
      'KAKAO',
    );
    console.log(user);
    expect(user).toBeDefined();
  });

  // 추가 테스트 케이스...

  afterAll(async () => {
    await app.close();
  });
});
