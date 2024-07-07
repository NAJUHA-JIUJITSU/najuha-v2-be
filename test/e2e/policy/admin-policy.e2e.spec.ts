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
import {
  CreatePolicyReqBody,
  CreatePolicyRes,
  FindPoliciesRes,
} from '../../../src/modules/policy/presentation/policy.controller.dto';
import { UserDummyBuilder } from '../../../src/dummy/user.dummy';
import { PolicyEntity } from '../../../src/database/entity/policy/policy.entity';
import { uuidv7 } from 'uuidv7';

describe('E2E a-4 admin-policy test', () => {
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

  describe('a-4-1 POST /admin/policies -----------------------------------------------------', () => {
    it('약관 생성하기 성공 시', async () => {
      /** pre condition. */
      const createPolicyReqBody = typia.random<CreatePolicyReqBody>();
      const dummyUser = new UserDummyBuilder().setRole('ADMIN').build();
      const accessToken = jwtService.sign(
        { userId: dummyUser.id, userRole: dummyUser.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      /** main test. */
      const createPolicyResponse = await request(app.getHttpServer())
        .post('/admin/policies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createPolicyReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePolicyRes>>(res.body);
        });
    });

    it('기존 존재하는 약관 타압의 약관을 새로 생성할 때, 버전이 올라가야 한다.', async () => {
      /** pre condition. */
      const createPolicyReqBody = typia.random<CreatePolicyReqBody>();
      createPolicyReqBody.type = 'TERMS_OF_SERVICE';
      const dummyUser = new UserDummyBuilder().setRole('ADMIN').build();
      const accessToken = jwtService.sign(
        { userId: dummyUser.id, userRole: dummyUser.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const initialCreatePolicyResponse = await request(app.getHttpServer())
        .post('/admin/policies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createPolicyReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePolicyRes>>(res.body);
        });

      /** main test. */
      const createPolicyReqBody2 = typia.random<CreatePolicyReqBody>();
      createPolicyReqBody2.type = 'TERMS_OF_SERVICE';
      const secondCreatePolicyResponse = await request(app.getHttpServer())
        .post('/admin/policies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createPolicyReqBody2)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePolicyRes>>(res.body);
        });
      expect(secondCreatePolicyResponse.result.policy.version).toEqual(
        initialCreatePolicyResponse.result.policy.version + 1,
      );
    });
  });

  describe('a-4-2 GET /admin/policies ------------------------------------------------------', () => {
    it('모든 약관 가져오기 성공 시', async () => {
      /** pre condition. */
      const policyTypes: IPolicy['type'][] = ['TERMS_OF_SERVICE', 'PRIVACY', 'REFUND', 'ADVERTISEMENT'];
      const maxVersion = 4;
      for (let version = 1; version <= maxVersion; version++) {
        await Promise.all(
          policyTypes.map((type) => {
            return entityEntityManager.save(PolicyEntity, {
              id: uuidv7(),
              type: type,
              isMandatory: true,
              title: `${type} 제목 ${version}`,
              content: `${type} 내용 ${version}`,
              version: version,
              createdAt: new Date(),
            });
          }),
        );
      }
      const dummyUser = new UserDummyBuilder().setRole('ADMIN').build();
      const accessToken = jwtService.sign(
        { userId: dummyUser.id, userRole: dummyUser.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      /** main test. */
      const findPoliciesResponse = await request(app.getHttpServer())
        .get('/admin/policies')
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<FindPoliciesRes>>(res.body);
        });
      expect(findPoliciesResponse.result.policies.length).toEqual(policyTypes.length * maxVersion);
    });

    it('특정 타입의 모든 버전의 약관 가져오기 성공 시', async () => {
      /** pre condition. */
      const policyTypes: IPolicy['type'][] = ['TERMS_OF_SERVICE', 'PRIVACY', 'REFUND', 'ADVERTISEMENT'];
      const query = { type: typia.random<IPolicy['type']>() };
      const maxVersion = 4;
      for (let version = 1; version <= maxVersion; version++) {
        await Promise.all(
          policyTypes.map((type) => {
            return entityEntityManager.save(PolicyEntity, {
              id: uuidv7(),
              type: type,
              isMandatory: true,
              title: `${type} 제목 ${version}`,
              content: `${type} 내용 ${version}`,
              version: version,
              createdAt: new Date(),
            });
          }),
        );
      }
      const dummyUser = new UserDummyBuilder().setRole('ADMIN').build();
      const accessToken = jwtService.sign(
        { userId: dummyUser.id, userRole: dummyUser.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      /** main test. */
      const findPoliciesByTypeResponse = await request(app.getHttpServer())
        .get('/admin/policies')
        .query(query)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<FindPoliciesRes>>(res.body);
        });
      expect(findPoliciesByTypeResponse.result.policies.length).toEqual(maxVersion);
      expect(findPoliciesByTypeResponse.result.policies[0].type).toEqual(query.type);
    });
  });
});
