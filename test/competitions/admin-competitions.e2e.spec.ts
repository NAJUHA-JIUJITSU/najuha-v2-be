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
import { COMPETITIONS_COMPETITION_STATUS_CANNOT_BE_ACTIVE } from 'src/common/response/errorResponse';
import { UserEntity } from 'src//database/entity/user/user.entity';
import {
  CreateCombinationDiscountSnapshotReqBody,
  CreateCombinationDiscountSnapshotRes,
  CreateCompetitionDivisionsRes,
  CreateCompetitionReqBody,
  CreateCompetitionRequiredAdditionalInfoReqBody,
  CreateCompetitionRes,
  CreateEarlybirdDiscountSnapshotReqBody,
  CreateEarlybirdDiscountSnapshotRes,
  FindCompetitionsRes,
  GetCompetitionRes,
  UpdateCompetitionRes,
  UpdateRequiredAdditionalInfoReqBody,
} from 'src/modules/competitions/presentation/competitions.controller.dto';
import { CompetitionEntity } from 'src//database/entity/competition/competition.entity';
import { UserDummyBuilder } from 'src/dummy/user-dummy';
import { CompetitionDummyBuilder } from 'src/dummy/competition.dummy';
import { generateDummyDivisionPacks } from 'src/dummy/division.dummy';
import { dummyCombinationDiscountRules } from 'src/dummy/combination-discount-snapshot.dummy';
import { CreateCompetitionRequiredAdditionalInfoRet } from 'src/modules/competitions/application/competitions.app.dto';
import { IRequiredAdditionalInfo } from 'src/modules/competitions/domain/interface/required-addtional-info.interface';
import { uuidv7 } from 'uuidv7';
import { RequiredAdditionalInfoEntity } from 'src//database/entity/competition/required-additional-info.entity';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { DateTime } from 'src/common/utils/date-time';

export const generateTestDummyCompetitions = (): ICompetition[] => {
  const competitions: ICompetition[] = [];
  const today = new Date();
  const start = DateTime.fromJSDate(today).minus({ days: 49 }).toJSDate();
  const end = DateTime.fromJSDate(today).plus({ days: 50 }).toJSDate();
  let count = 0;
  for (
    let competitionDate = new Date(start);
    competitionDate <= end;
    competitionDate = DateTime.fromJSDate(competitionDate).plus({ days: 1 }).toJSDate()
  ) {
    competitions.push(
      // 1. 비협약
      new CompetitionDummyBuilder()
        .setTitle(`${count++}`)
        .setIsPartnership(false)
        .setCompetitionBasicDates(competitionDate)
        .build(),
      new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle(`${count++}`)
        .setCompetitionBasicDates(competitionDate)
        // .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .build(),
    );
  }
  return competitions;
};

describe('E2E a-5 competitions TEST', () => {
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

  describe('a-5-1 POST /admin/competitions -------------------------------------------------------------------------', () => {
    it('대회 생성하기 성공 시', async () => {
      /** main test. */
      const CreateCompetitionReqDto = typia.random<CreateCompetitionReqBody>();
      const res = await request(app.getHttpServer())
        .post('/admin/competitions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(CreateCompetitionReqDto);
      console.log(res.body);
      expect(typia.is<ResponseForm<CreateCompetitionRes>>(res.body)).toBe(true);
    });
  });

  describe('a-5-2 GET /admin/competitions --------------------------------------------------------------------------', () => {
    it('find many competitions 성공시', async () => {
      /** pre condition. */
      const competitions = generateTestDummyCompetitions();
      await entityEntityManager.save(CompetitionEntity, competitions);
      /** main test. */
      const res = await request(app.getHttpServer())
        .get('/admin/competitions')
        .set('Authorization', `Bearer ${adminAccessToken}`);
      expect(typia.is<ResponseForm<FindCompetitionsRes>>(res.body)).toBe(true);
    });
  });

  describe('a-5-3 GET /admin/competitions/:competitionId -----------------------------------------------------------', () => {
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
        .get(`/admin/competitions/${competition.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      expect(typia.is<ResponseForm<GetCompetitionRes>>(res.body)).toBe(true);
    });
  });

  describe('a-5-4 PATCH /admin/competitions/:competitionId ---------------------------------------------------------', () => {
    it('대회 수정하기 성공 시', async () => {
      /** pre condition. */
      const competition = new CompetitionDummyBuilder()
        .setTitle('dummy competition')
        .setIsPartnership(true)
        .setCompetitionBasicDates(new Date())
        .build();
      await entityEntityManager.save(CompetitionEntity, competition);
      /** main test. */
      const res = await request(app.getHttpServer())
        .patch(`/admin/competitions/${competition.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ title: '수정된 대회' });
      expect(typia.is<ResponseForm<UpdateCompetitionRes>>(res.body)).toBe(true);
      expect(res.body.result.competition.title).toBe('수정된 대회');
    });
  });

  describe('a-5-5 PATCH /admin/competitions/:competitionId/status --------------------------------------------------', () => {
    it('대회 상태 수정 INACTIVE -> ACTIVE 성공 시', async () => {
      /** pre condition. */
      const competition = new CompetitionDummyBuilder()
        .setTitle('dummy competition')
        .setIsPartnership(true)
        .setCompetitionBasicDates(new Date())
        .build();
      await entityEntityManager.save(CompetitionEntity, competition);
      /** main test. */
      const res = await request(app.getHttpServer())
        .patch(`/admin/competitions/${competition.id}/status`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ status: 'ACTIVE' });
      expect(typia.is<ResponseForm<UpdateCompetitionRes>>(res.body)).toBe(true);
      expect(res.body.result.competition.status).toBe('ACTIVE');
    });

    it('대회 상태 수정 INACTIVE -> ACTIVE 실패 시', async () => {
      /** pre condition. */
      const competition = new CompetitionDummyBuilder()
        .setTitle('dummy competition')
        .setIsPartnership(true)
        .setStatus('INACTIVE')
        .setCompetitionDate(null)
        .setRegistrationStartDate(null)
        .setRegistrationEndDate(null)
        .setRefundDeadlineDate(null)
        .build();
      await entityEntityManager.save(CompetitionEntity, competition);
      /** main test. */
      const res = await request(app.getHttpServer())
        .patch(`/admin/competitions/${competition.id}/status`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ status: 'ACTIVE' });
      expect(typia.is<COMPETITIONS_COMPETITION_STATUS_CANNOT_BE_ACTIVE>(res.body)).toBe(true);
    });

    it('대회 상태 수정 ACTIVE -> INACTIVE 성공 시', async () => {
      /** pre condition. */
      const competition = new CompetitionDummyBuilder()
        .setTitle('dummy competition')
        .setIsPartnership(true)
        .setCompetitionBasicDates(new Date())
        .setStatus('ACTIVE')
        .build();
      await entityEntityManager.save(CompetitionEntity, competition);
      /** main test. */
      const res = await request(app.getHttpServer())
        .patch(`/admin/competitions/${competition.id}/status`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ status: 'INACTIVE' });
      expect(typia.is<ResponseForm<UpdateCompetitionRes>>(res.body)).toBe(true);
      expect(res.body.result.competition.status).toBe('INACTIVE');
    });
  });

  describe('a-5-6 POST /admin/competitions/:competitionId/divisions ------------------------------------------------', () => {
    it('대회 부문 생성하기 성공 시', async () => {
      /** pre condition. */
      const competition = new CompetitionDummyBuilder()
        .setTitle('dummy competition')
        .setIsPartnership(true)
        .setCompetitionBasicDates(new Date())
        .build();
      await entityEntityManager.save(CompetitionEntity, competition);
      /** main test. */
      const divisionPacks = generateDummyDivisionPacks();
      const res = await request(app.getHttpServer())
        .post(`/admin/competitions/${competition.id}/divisions`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ divisionPacks });
      expect(typia.is<ResponseForm<CreateCompetitionDivisionsRes>>(res.body)).toBe(true);
      expect(res.body.result.competition.divisions.length !== 0).toBe(true);
    });
  });

  describe('a-5-7 POST /admin/competitions/:competitionId/earlybird-discount-snapshots -----------------------------', () => {
    it('대회 얼리버드 할인 스냅샷 생성하기 성공 시', async () => {
      /** pre condition. */
      const competition = new CompetitionDummyBuilder()
        .setTitle('dummy competition')
        .setIsPartnership(true)
        .setCompetitionBasicDates(new Date())
        .build();
      await entityEntityManager.save(CompetitionEntity, competition);
      /** main test. */
      const createEarlybirdDiscountSnapshotReqBody: CreateEarlybirdDiscountSnapshotReqBody = {
        earlybirdStartDate: new Date(),
        earlybirdEndDate: new Date(),
        discountAmount: 10000,
      };
      const res = await request(app.getHttpServer())
        .post(`/admin/competitions/${competition.id}/earlybird-discount-snapshots`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(createEarlybirdDiscountSnapshotReqBody);
      expect(typia.is<ResponseForm<CreateEarlybirdDiscountSnapshotRes>>(res.body)).toBe(true);
      expect(res.body.result.competition.earlybirdDiscountSnapshots.length).toBe(1);
    });
  });

  describe('a-5-8 POST /admin/competitions/:competitionId/combination-discount-snapshots ---------------------------', () => {
    it('대회 조합 할인 스냅샷 생성하기 성공 시', async () => {
      /** pre condition. */
      const competition = new CompetitionDummyBuilder()
        .setTitle('dummy competition')
        .setIsPartnership(true)
        .setCompetitionBasicDates(new Date())
        .build();
      await entityEntityManager.save(CompetitionEntity, competition);
      /** main test. */
      const createCombinationDiscountSnapshotReqBody: CreateCombinationDiscountSnapshotReqBody = {
        combinationDiscountRules: dummyCombinationDiscountRules,
      };
      const res = await request(app.getHttpServer())
        .post(`/admin/competitions/${competition.id}/combination-discount-snapshots`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(createCombinationDiscountSnapshotReqBody);
      expect(typia.is<ResponseForm<CreateCombinationDiscountSnapshotRes>>(res.body)).toBe(true);
      expect(res.body.result.competition.combinationDiscountSnapshots.length).toBe(1);
    });
  });

  describe('a-5-9 POST /admin/competitions/:competitionId/required-additional-infos --------------------------------', () => {
    it('대회 필수 추가 정보 생성하기 성공 시', async () => {
      /** pre condition. */
      const competition = new CompetitionDummyBuilder()
        .setTitle('dummy competition')
        .setIsPartnership(true)
        .setCompetitionBasicDates(new Date())
        .build();
      await entityEntityManager.save(CompetitionEntity, competition);
      /** main test. */
      const createCompetitionRequiredAdditionalInfoReqBody: CreateCompetitionRequiredAdditionalInfoReqBody = {
        type: 'ADDRESS',
        description: '주소',
      };
      const res = await request(app.getHttpServer())
        .post(`/admin/competitions/${competition.id}/required-additional-infos`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(createCompetitionRequiredAdditionalInfoReqBody);
      expect(typia.is<ResponseForm<CreateCompetitionRequiredAdditionalInfoRet>>(res.body)).toBe(true);
      expect(res.body.result.competition.requiredAdditionalInfos.length).toBe(1);
    });
  });

  describe('a-5-10 PATCH /admin/competitions/:competitionId/required-additional-infos/:requiredAdditionalInfoId ----', () => {
    it('대회 필수 추가 정보 수정하기 성공 시', async () => {
      /** pre condition. */
      const competition = new CompetitionDummyBuilder()
        .setTitle('dummy competition')
        .setIsPartnership(true)
        .setCompetitionBasicDates(new Date())
        .build();
      const requiredAdditionalInfo: IRequiredAdditionalInfo = {
        id: uuidv7(),
        type: 'ADDRESS',
        description: '주소',
        competitionId: competition.id,
        createdAt: new Date(),
        deletedAt: null,
      };
      await entityEntityManager.save(CompetitionEntity, competition);
      await entityEntityManager.save(RequiredAdditionalInfoEntity, requiredAdditionalInfo);
      /** main test. */
      const updateRequiredAdditionalInfoReqBody: UpdateRequiredAdditionalInfoReqBody = {
        description: 'updated description',
      };
      const res = await request(app.getHttpServer())
        .patch(`/admin/competitions/${competition.id}/required-additional-infos/${requiredAdditionalInfo.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateRequiredAdditionalInfoReqBody);
      expect(typia.is<ResponseForm<CreateCompetitionRequiredAdditionalInfoRet>>(res.body)).toBe(true);
      const createdRequiredAdditionalInfo: IRequiredAdditionalInfo =
        res.body.result.competition.requiredAdditionalInfos.find(
          (rai: IRequiredAdditionalInfo) => rai.id === requiredAdditionalInfo.id,
        );
      expect(createdRequiredAdditionalInfo.description).toBe(updateRequiredAdditionalInfoReqBody.description);
    });
  });

  describe('a-5-11 DELETE /admin/competitions/:competitionId/required-additional-infos/:requiredAdditionalInfoId ---', () => {
    it('대회 필수 추가 정보 삭제하기 성공 시', async () => {
      /** pre condition. */
      const competition = new CompetitionDummyBuilder()
        .setTitle('dummy competition')
        .setIsPartnership(true)
        .setCompetitionBasicDates(new Date())
        .build();
      const requiredAdditionalInfo: IRequiredAdditionalInfo = {
        id: uuidv7(),
        type: 'ADDRESS',
        description: '주소',
        competitionId: competition.id,
        createdAt: new Date(),
        deletedAt: null,
      };
      await entityEntityManager.save(CompetitionEntity, competition);
      await entityEntityManager.save(RequiredAdditionalInfoEntity, requiredAdditionalInfo);
      /** main test. */
      const res = await request(app.getHttpServer())
        .delete(`/admin/competitions/${competition.id}/required-additional-infos/${requiredAdditionalInfo.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      expect(typia.is<ResponseForm<CreateCompetitionRequiredAdditionalInfoRet>>(res.body)).toBe(true);
      const deletedRequiredAdditionalInfo = await entityEntityManager.findOne(RequiredAdditionalInfoEntity, {
        where: { id: requiredAdditionalInfo.id },
      });
      expect(deletedRequiredAdditionalInfo).toBe(null);
    });
  });
});
