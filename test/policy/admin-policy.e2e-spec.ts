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
import { PolicyEntity } from 'src/policy/entities/policy.entity';
import { PolicyService } from 'src/policy/policy.service';
import { CreatePolicyDto } from 'src/policy/dto/create-policy.dto';
import exp from 'constants';
// import * as Apis from '../../src/api/functional';

describe('E2E a-4 admin-policy test', () => {
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

  describe('a-4-1 POST /admin/policy -----------------------------------------------------', () => {
    it('약관 생성하기 성공 시', async () => {
      const createPolicyDto = typia.random<CreatePolicyDto>();
      const accessToken = jwtService.sign(
        { userId: 1, userRole: 'ADMIN' },
        { secret: appConfig.jwtAccessTokenSecret, expiresIn: appConfig.jwtAccessTokenExpirationTime },
      );

      const res = await request(app.getHttpServer())
        .post('/admin/policy')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createPolicyDto);
    });
  });

  describe('a-4-2 GET /admin/policy ------------------------------------------------------', () => {
    it('모든 약관 가져오기 성공 시', async () => {
      const policyTypes: PolicyEntity['type'][] = ['TERMS_OF_SERVICE', 'PRIVACY', 'REFUND', 'ADVERTISEMENT'];
      const maxVersion = 4;

      for (let version = 1; version <= maxVersion; version++) {
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
      }

      const accessToken = jwtService.sign(
        { userId: 1, userRole: 'ADMIN' },
        { secret: appConfig.jwtAccessTokenSecret, expiresIn: appConfig.jwtAccessTokenExpirationTime },
      );

      const res = await request(app.getHttpServer()).get('/admin/policy').set('Authorization', `Bearer ${accessToken}`);
      expect(typia.is<ResponseForm<PolicyEntity[]>>(res.body)).toBe(true);
      expect(res.body.data.length).toEqual(policyTypes.length * maxVersion);
    });

    it('특정 타입의 모든 버전의 약관 가져오기 성공 시', async () => {
      const policyTypes: PolicyEntity['type'][] = ['TERMS_OF_SERVICE', 'PRIVACY', 'REFUND', 'ADVERTISEMENT'];
      const query = { type: typia.random<PolicyEntity['type']>() };
      const maxVersion = 4;

      for (let version = 1; version <= maxVersion; version++) {
        await Promise.all(
          policyTypes.map((type) => {
            return policyService.createPolicy({
              type: type,
              isMandatory: true,
              title: `${type} 제목 ${version}`,
              content: `${type} 내용 ${version}`,
            });
          }),
        );
      }

      const accessToken = jwtService.sign(
        { userId: 1, userRole: 'ADMIN' },
        { secret: appConfig.jwtAccessTokenSecret, expiresIn: appConfig.jwtAccessTokenExpirationTime },
      );

      const res = await request(app.getHttpServer())
        .get('/admin/policy')
        .query(query)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(typia.is<ResponseForm<PolicyEntity[]>>(res.body)).toBe(true);
      expect(res.body.data.length).toEqual(maxVersion);
      expect(res.body.data[0].type).toEqual(query.type);
    });
  });
});
