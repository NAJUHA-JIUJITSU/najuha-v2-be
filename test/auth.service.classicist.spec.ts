import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { UsersService } from 'src/users/users.service';

describe('AuthService', () => {
  let module: TestingModule;
  let dataSource: DataSource;
  let authService: AuthService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
    authService = module.get<AuthService>(AuthService);
  });

  beforeEach(async () => {
    const entities = dataSource.entityMetadatas;

    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.clear();
    }
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('kakaoLogin', () => {
    it('should login with kakao', async () => {
      jest
        .spyOn(authService as any, 'getKakaoAccessToken')
        .mockImplementation(() => {
          return 'fake_access_token';
        });
    });
  });
  // 이하 테스트 케이스 추가
});
