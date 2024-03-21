import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import typia from 'typia';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import appEnv from '../../src/common/app-env';
import { ResponseForm } from 'src/common/response/response';
import { DataSource, EntityManager } from 'typeorm';
import { UsersAppService } from 'src/modules/users/application/users.app.service';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import { User } from 'src/infrastructure/database/entities/user/user.entity';
import { Policy } from 'src/infrastructure/database/entities/policy/policy.entity';
import { PolicyAppService } from 'src/modules/policy/application/policy.app.service';
// import * as Apis from '../../src/api/functional';

describe('E2E u-4 user-policy test', () => {
  let app: INestApplication;
  let testingModule: TestingModule;
  let dataSource: DataSource;
  let entityManager: EntityManager;
  let tableNames: string;
  let redisClient: Redis;
  let jwtService: JwtService;
  let userService: UsersAppService;
  let PolicyAppService: PolicyAppService;

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
    PolicyAppService = testingModule.get<PolicyAppService>(PolicyAppService);
    (await app.init()).listen(appEnv.appPort);
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
      const policyTypes: Policy['type'][] = ['TERMS_OF_SERVICE', 'PRIVACY', 'REFUND', 'ADVERTISEMENT'];
      await Promise.all(
        policyTypes.map((type) => {
          return PolicyAppService.createPolicy({
            type: type,
            isMandatory: true,
            title: `${type} 제목`,
            content: `${type} 내용`,
          });
        }),
      );

      const res = await request(app.getHttpServer()).get('/user/policy/recent');
      expect(typia.is<ResponseForm<Policy[]>>(res.body)).toBe(true);
      expect(res.body.result.length).toEqual(policyTypes.length);
    });
  });

  describe('u-4-2 GET /user/policy/:id --------------------------------------------------', () => {
    it('약관 ID로 약관을 가져오기 성공 시', async () => {
      const policy = await PolicyAppService.createPolicy({
        type: 'TERMS_OF_SERVICE',
        isMandatory: true,
        title: `TERMS_OF_SERVICE 제목`,
        content: `TERMS_OF_SERVICE 내용`,
      });

      const res = await request(app.getHttpServer()).get(`/user/policy/${policy.id}`);
      expect(typia.is<ResponseForm<Policy>>(res.body)).toBe(true);
      expect(res.body.result.id).toEqual(policy.id);
    });
  });
});
