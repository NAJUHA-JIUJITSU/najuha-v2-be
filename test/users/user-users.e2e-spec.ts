import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import typia from 'typia';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import appConfig from '../../src/common/appConfig';
import { ResponseForm } from 'src/common/response/response';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
// import * as Apis from '../../src/api/functional';

describe('E2E u-3 user-users test', () => {
  let app: INestApplication;
  let testingModule: TestingModule;
  let dataSource: DataSource;
  let entityManager: EntityManager;
  let tableNames: string;
  let redisClient: Redis;
  let jwtService: JwtService;
  let userService: UsersService;

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
    userService = testingModule.get<UsersService>(UsersService);
    (await app.init()).listen(appConfig.appPort);
  });

  afterEach(async () => {
    await entityManager.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`);
    await redisClient.flushall();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('u-3-2 PATCH /user/users --------------------------------------------------', () => {
    it('유저 정보 수정 성공 시', async () => {
      const user = typia.random<Omit<UserEntity, 'createdAt' | 'updatedAt' | 'id'>>();
      user.role = 'USER';
      user.birth = '19980101';
      const userEntity = await userService.createUser(user);
      const accessToken = jwtService.sign(
        { userId: userEntity.id, userRole: userEntity.role },
        { secret: appConfig.jwtAccessTokenSecret, expiresIn: appConfig.jwtAccessTokenExpirationTime },
      );

      const updateUserDto: UpdateUserDto = {
        name: 'updateName',
        nickname: 'updateNickname',
        gender: 'MALE',
        belt: '블랙',
        birth: '19980101',
      };

      console.log('updateUserDto:', updateUserDto);

      const res = await request(app.getHttpServer())
        .patch('/user/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUserDto);

      expect(typia.is<ResponseForm<UserEntity>>(res.body)).toBe(true);
    });
  });

  describe('u-3-3 GET /user/users/me --------------------------------------------------', () => {
    it('내 정보 조회 성공 시', async () => {
      const user = typia.random<Omit<UserEntity, 'createdAt' | 'updatedAt' | 'id'>>();
      user.role = 'USER';
      user.birth = '19980101';
      const userEntity = await userService.createUser(user);
      const accessToken = jwtService.sign(
        { userId: userEntity.id, userRole: userEntity.role },
        { secret: appConfig.jwtAccessTokenSecret, expiresIn: appConfig.jwtAccessTokenExpirationTime },
      );

      const res = await request(app.getHttpServer())
        .get('/user/users/me')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(typia.is<ResponseForm<UserEntity>>(res.body)).toBe(true);
      expect(res.body.data.id).toEqual(userEntity.id);
    });
  });
});
