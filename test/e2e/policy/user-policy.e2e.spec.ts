import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import typia from 'typia';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import appEnv from '../../../src/common/app-env';
import { ResponseForm } from '../../../src/common/response/response';
import { DataSource, EntityManager } from 'typeorm';
import { UsersAppService } from '../../../src/modules/users/application/users.app.service';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import { PolicyAppService } from '../../../src/modules/policy/application/policy.app.service';
import { IPolicy } from '../../../src/modules/policy/domain/interface/policy.interface';
import { FindPoliciesRes, GetPolicyRes } from '../../../src/modules/policy/presentation/policy.controller.dto';
import { PolicyEntity } from '../../../src/database/entity/policy/policy.entity';
import { uuidv7 } from 'uuidv7';

describe('E2E u-4 user-policies test', () => {
  let app: INestApplication;
  let testingModule: TestingModule;
  let dataSource: DataSource;
  let entityEntityManager: EntityManager;
  let tableNames: string;
  let redisClient: Redis;
  let jwtService: JwtService;
  let userService: UsersAppService;
  let policyAppService: PolicyAppService;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    dataSource = testingModule.get<DataSource>(DataSource);
    entityEntityManager = testingModule.get<EntityManager>(EntityManager);
    tableNames = entityEntityManager.connection.entityMetadatas.map((entity) => `"${entity.tableName}"`).join(', ');
    redisClient = testingModule.get<Redis>('REDIS_CLIENT');
    jwtService = testingModule.get<JwtService>(JwtService);
    userService = testingModule.get<UsersAppService>(UsersAppService);
    policyAppService = testingModule.get<PolicyAppService>(PolicyAppService);

    (await app.init()).listen(appEnv.appPort);
  });

  afterEach(async () => {
    await entityEntityManager.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`);
    await redisClient.flushall();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('u-4-1 GET /user/policies/latest --------------------------------------------------', () => {
    it('가장 최근에 등록된 모든 타입의 약관을 가져오기 성공 시', async () => {
      /** pre condition. */
      const policyTypes: IPolicy['type'][] = ['TERMS_OF_SERVICE', 'PRIVACY', 'REFUND', 'ADVERTISEMENT'];
      await Promise.all(
        policyTypes.map((type) => {
          return entityEntityManager.save(PolicyEntity, {
            id: uuidv7(),
            type,
            isMandatory: true,
            title: `${type} 제목`,
            content: `${type} 내용`,
            version: 1,
            createdAt: new Date(),
          });
        }),
      );
      /** main test. */
      const getLatestPoliciesResponse = await request(app.getHttpServer())
        .get('/user/policies/latest')
        .then((res) => {
          return typia.assert<ResponseForm<FindPoliciesRes>>(res.body);
        });
      expect(getLatestPoliciesResponse.result.policies.every((policy) => policyTypes.includes(policy.type))).toBe(true);
    });
  });

  describe('u-4-2 GET /user/policies/:id --------------------------------------------------', () => {
    it('약관 ID로 약관을 가져오기 성공 시', async () => {
      /** pre condition. */
      const policy = await entityEntityManager.save(PolicyEntity, {
        id: uuidv7(),
        type: 'TERMS_OF_SERVICE',
        isMandatory: true,
        title: `TERMS_OF_SERVICE 제목`,
        content: `TERMS_OF_SERVICE 내용`,
        version: 1,
        createdAt: new Date(),
      });
      /** main test. */
      const getPolicyByIdResponse = await request(app.getHttpServer())
        .get(`/user/policies/${policy.id}`)
        .then((res) => {
          return typia.assert<ResponseForm<GetPolicyRes>>(res.body);
        });
      expect(getPolicyByIdResponse.result.policy.id).toEqual(policy.id);
    });
  });
});
