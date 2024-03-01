import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import typia from 'typia';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import appConfig from '../../src/common/appConfig';
import { ResponseForm } from 'src/common/response/response';
import { DataSource, EntityManager } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import { UserEntity } from 'src/users/entities/user.entity';
import { PolicyEntity } from 'src/policy/entities/policy.entity';
import { PolicyService } from 'src/policy/policy.service';
// import * as Apis from '../../src/api/functional';

describe('E2E u-4 user-policy test', () => {
  let app: INestApplication;
  let testingModule: TestingModule;
  let dataSource: DataSource;
  let entityManager: EntityManager;
  let tableNames: string;
  let redisClient: Redis;
  let jwtService: JwtService;
  let userService: UsersService;
  let policyService: PolicyService;

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
    policyService = testingModule.get<PolicyService>(PolicyService);
    (await app.init()).listen(appConfig.appPort);
  });

  afterEach(async () => {
    await entityManager.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`);
    await redisClient.flushall();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('u-4-1 GET /user/policy/recent --------------------------------------------------', () => {
    it('가장 최근에 등록된 모든 타입의 약관을 가져오기 성공 시', async () => {
      const policyTypes: PolicyEntity['type'][] = ['TERMS_OF_SERVICE', 'PRIVACY', 'REFUND', 'ADVERTISEMENT'];
      await Promise.all(
        policyTypes.map((type) => {
          return policyService.createPolicy({
            type: type,
            isMandatory: true,
            title: `${type} 제목`,
            content: `${type} 내용`,
          });
        }),
      );

      const res = await request(app.getHttpServer()).get('/user/policy/recent');
      expect(typia.is<ResponseForm<PolicyEntity[]>>(res.body)).toBe(true);
      expect(res.body.data.length).toEqual(policyTypes.length);
    });
  });

  describe('u-4-2 GET /user/policy/:id --------------------------------------------------', () => {
    it('약관 ID로 약관을 가져오기 성공 시', async () => {
      const policy = await policyService.createPolicy({
        type: 'TERMS_OF_SERVICE',
        isMandatory: true,
        title: `TERMS_OF_SERVICE 제목`,
        content: `TERMS_OF_SERVICE 내용`,
      });

      const res = await request(app.getHttpServer()).get(`/user/policy/${policy.id}`);
      expect(typia.is<ResponseForm<PolicyEntity>>(res.body)).toBe(true);
      expect(res.body.data.id).toEqual(policy.id);
    });
  });
});
