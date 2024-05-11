import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import typia from 'typia';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import appEnv from '../../src/common/app-env';
import { ResponseForm } from 'src/common/response/response';
import { EntityManager } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import { UserEntity } from 'src//database/entity/user/user.entity';
import { FindCompetitionsRes, GetCompetitionRes } from 'src/modules/competitions/presentation/dtos';
import { CompetitionEntity } from 'src//database/entity/competition/competition.entity';
import { UserDummyBuilder } from 'src/dummy/user-dummy';
import { CompetitionDummyBuilder, generateDummyCompetitions } from 'src/dummy/competition.dummy';

describe('E2E u-5 competitions TEST', () => {
  let app: INestApplication;
  let testingModule: TestingModule;
  let entityEntityManager: EntityManager;
  let tableNames: string;
  let redisClient: Redis;
  let jwtService: JwtService;
  let adminAccessToken: string;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    entityEntityManager = testingModule.get<EntityManager>(EntityManager);
    tableNames = entityEntityManager.connection.entityMetadatas.map((entity) => `"${entity.tableName}"`).join(', ');
    redisClient = testingModule.get<Redis>('REDIS_CLIENT');
    jwtService = testingModule.get<JwtService>(JwtService);
    (await app.init()).listen(appEnv.appPort);
    const user = new UserDummyBuilder().setRole('USER').build();
    await entityEntityManager.save(UserEntity, user);
    adminAccessToken = jwtService.sign(
      { userId: user.id, userRole: user.role },
      { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
    );
  });

  afterEach(async () => {
    await entityEntityManager.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`);
    await redisClient.flushall();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('u-5-1 GET /user/competitions --------------------------------------------------------------------------', () => {
    it('find many competitions 성공시', async () => {
      /** pre condition. */
      const competitions = generateDummyCompetitions();
      await entityEntityManager.save(CompetitionEntity, competitions);
      /** main test. */
      const res = await request(app.getHttpServer())
        .get('/user/competitions')
        .set('Authorization', `Bearer ${adminAccessToken}`);
      expect(typia.is<ResponseForm<FindCompetitionsRes>>(res.body)).toBe(true);
    });
  });

  describe('u-5-2 GET /user/competitions/:competitionId -----------------------------------------------------------', () => {
    it('get competition 성공시', async () => {
      /** pre condition. */
      const competition = new CompetitionDummyBuilder()
        .setTitle('dummy competition')
        .setIsPartnership(true)
        .setCompetitionBasicDates(new Date())
        .build();
      await entityEntityManager.save(CompetitionEntity, competition);
      /** main test. */
      const res = await request(app.getHttpServer())
        .get(`/user/competitions/${competition.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      expect(typia.is<ResponseForm<GetCompetitionRes>>(res.body)).toBe(true);
    });
  });
});
