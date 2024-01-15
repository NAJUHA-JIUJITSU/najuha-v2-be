import { AuthService } from '../src/auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { UsersService } from '../src/users/users.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              if (key === 'JWT_ACCESS_TOKEN_SECRET') {
                return 'test-secret';
              }
              if (key === 'JWT_ACCESS_TOKEN_EXPIRATION_TIME') {
                return '60s'; // "60s" 또는 적절한 시간 값을 제공합니다.
              }
              return null;
            }),
          },
        },
        {
          provide: HttpService,
          // 필요한 경우 모의 HttpService 또는 실제 인스턴스
          useValue: { get: jest.fn(), post: jest.fn() },
        },
        {
          provide: UsersService,
          // 필요한 경우 모의 UsersService 또는 실제 인스턴스
          useValue: { findUserBySnsIdaAndSnsProvider: jest.fn() },
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should create a valid access token', () => {
    const userId = 1;
    const userRole = 'USER';
    const token = authService.createAccessToken(userId, userRole);
    expect(jwtService.verify(token, { secret: 'test-secret' })).toBeTruthy();
  });
});
