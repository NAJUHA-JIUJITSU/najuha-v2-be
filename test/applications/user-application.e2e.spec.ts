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
import { CompetitionEntity } from 'src//database/entity/competition/competition.entity';
import { UserDummyBuilder } from 'src/dummy/user-dummy';
import { CompetitionDummyBuilder, generateDummyCompetitions } from 'src/dummy/competition.dummy';
import { generateDummyDivisionPacks } from 'src/dummy/division.dummy';
import { dummyCombinationDiscountRules } from 'src/dummy/combination-discount-snapshot.dummy';
import { CreateCompetitionRequiredAdditionalInfoRet } from 'src/modules/competitions/application/competitions.app.dto';
import { IRequiredAdditionalInfo } from 'src/modules/competitions/domain/interface/required-addtional-info.interface';
import { uuidv7 } from 'uuidv7';
import { RequiredAdditionalInfoEntity } from 'src//database/entity/competition/required-additional-info.entity';

describe('E2E u-5 applications TEST', () => {
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
    const adminUser = new UserDummyBuilder().setRole('ADMIN').build();
    await entityEntityManager.save(UserEntity, adminUser);
    adminAccessToken = jwtService.sign(
      { userId: adminUser.id, userRole: adminUser.role },
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

  // describe('더미 대회 생성하기 -----------------------------------------------------------------------------------------', () => {
  //   const competitions = generateDummyCompetitions();
  //   console.log(competitions);
  // });
});
