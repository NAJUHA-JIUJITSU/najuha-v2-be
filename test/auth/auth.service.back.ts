import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';
import { AuthService } from '../../src/auth/auth.service';
import { KakaoUserResponseData } from '../../src/sns-auth/types/kakao-user-data.type';
import { UserEntity } from '../../src/users/entities/user.entity';
import { UsersService } from '../../src/users/users.service';

const mockedKakaoUserInfo: KakaoUserResponseData = {
  id: '4400',
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

const fakeDatabase: UserEntity[] = [];

describe('AuthService kakaoLogin', () => {
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

  it('kakaoLogin with realDB', async () => {
    const dto = { snsAuthCode: 'dummy-code' };

    jest.spyOn(authService as any, 'getKakaoAccessToken').mockResolvedValue('mocked-access-token');

    jest.spyOn(authService as any, 'getKakaoUserData').mockResolvedValue(mockedKakaoUserInfo);

    const response = await authService.kakaoLogin(dto);
    expect(response).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });

    const user = await usersService.findUserBySnsIdAndProvider(mockedKakaoUserInfo.id, 'KAKAO');
    expect(user).toBeDefined();
  });

  it('kakaoLogin with mocked DB', async () => {
    const dto = { snsAuthCode: 'dummy-code' };

    jest.spyOn(authService as any, 'getKakaoAccessToken').mockResolvedValue('mocked-access-token');

    jest.spyOn(authService as any, 'getKakaoUserData').mockResolvedValue(mockedKakaoUserInfo);

    jest.spyOn(UsersService.prototype, 'createUser').mockImplementation((createUserDto) => {
      const newUser = new UserEntity();
      newUser.snsId = createUserDto.snsId;
      newUser.snsProvider = createUserDto.snsProvider;
      newUser.name = createUserDto.name;
      newUser.email = createUserDto.email;
      newUser.phoneNumber = createUserDto.phoneNumber;
      newUser.gender = createUserDto.gender;

      // UserEntity에 필요한 추가적인 속성들 설정
      newUser.id = fakeDatabase.length + 4;
      newUser.role = 'ADMIN'; // 또는 다른 기본값
      newUser.status = 'ACTIVE'; // 기본 상태
      newUser.createdAt = new Date(); // 현재 날짜/시간
      newUser.updatedAt = new Date(); // 현재 날짜/시간

      // 선택적인 속성들 (nickname, belt, weight 등)
      newUser.nickname = null;
      newUser.belt = null;
      newUser.weight = null;
      fakeDatabase.push(newUser);
      return Promise.resolve(newUser);
    });

    jest.spyOn(UsersService.prototype, 'findUserBySnsIdAndProvider').mockImplementation((snsId, snsProvider) => {
      const user = fakeDatabase.find((u) => u.snsId === snsId && u.snsProvider === snsProvider);
      return Promise.resolve(user ? user : null);
    });

    const response = await authService.kakaoLogin(dto);
    expect(response).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
    console.log(response);
    const user = await usersService.findUserBySnsIdAndProvider(mockedKakaoUserInfo.id, 'KAKAO');
    console.log(fakeDatabase);
    expect(user).toBeDefined();
  });

  // 추가 테스트 케이스...

  afterAll(async () => {
    await app.close();
  });
});
