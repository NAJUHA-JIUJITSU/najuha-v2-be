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
import { UserEntity } from 'src/infrastructure/database/entity/user/user.entity';
import {
  CreateCombinationDiscountSnapshotReqBody,
  CreateCombinationDiscountSnapshotRes,
  CreateCompetitionReqBody,
  CreateCompetitionRes,
  CreateDivisionsRes,
  CreateEarlybirdDiscountSnapshotReqBody,
  CreateEarlybirdDiscountSnapshotRes,
  CreateRequiredAdditionalInfoReqBody,
  FindCompetitionsRes,
  GetCompetitionRes,
  UpdateCompetitionRes,
  UpdateRequiredAdditionalInfoReqBody,
} from 'src/modules/competitions/presentation/dtos';
import { CompetitionEntity } from 'src/infrastructure/database/entity/competition/competition.entity';
import { UserDummyBuilder } from 'src/dummy/user-dummy';
import { CompetitionDummyBuilder, generateDummyCompetitions } from 'src/dummy/competition.dummy';
import { generateDummyDivisionPacks } from 'src/dummy/division.dummy';
import { dummyCombinationDiscountRules } from 'src/dummy/combination-discount-snapshot.dummy';
import { CreateRequiredAdditionalInfoRet } from 'src/modules/competitions/application/dtos';
import { IRequiredAdditionalInfo } from 'src/modules/competitions/domain/interface/required-addtional-info.interface';
import { ulid } from 'ulid';
import { RequiredAdditionalInfoEntity } from 'src/infrastructure/database/entity/competition/required-additional-info.entity';

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
    it('대회 조회하기 성공 시', async () => {
      const competitions = generateDummyCompetitions();
      await entityEntityManager.save(CompetitionEntity, competitions);
      const res = await request(app.getHttpServer())
        .get('/admin/competitions')
        .set('Authorization', `Bearer ${adminAccessToken}`);
      expect(typia.is<ResponseForm<FindCompetitionsRes>>(res.body)).toBe(true);
    });
  });

  describe('a-5-3 GET /admin/competitions/:competitionId -----------------------------------------------------------', () => {
    it('대회 조회하기 성공 시', async () => {
      const competition = new CompetitionDummyBuilder()
        .setTitle('dummy competition')
        .setIsPartnership(true)
        .setCompetitionDates(new Date())
        .build();
      await entityEntityManager.save(CompetitionEntity, competition);
      const res = await request(app.getHttpServer())
        .get(`/admin/competitions/${competition.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      expect(typia.is<ResponseForm<GetCompetitionRes>>(res.body)).toBe(true);
    });
  });

  describe('a-5-4 PATCH /admin/competitions/:competitionId ---------------------------------------------------------', () => {
    it('대회 수정하기 성공 시', async () => {
      const competition = new CompetitionDummyBuilder()
        .setTitle('dummy competition')
        .setIsPartnership(true)
        .setCompetitionDates(new Date())
        .build();
      await entityEntityManager.save(CompetitionEntity, competition);
      const res = await request(app.getHttpServer())
        .patch(`/admin/competitions/${competition.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ title: '수정된 대회' });
      expect(typia.is<ResponseForm<UpdateCompetitionRes>>(res.body)).toBe(true);
    });
  });

  describe('a-5-5 PATCH /admin/competitions/:competitionId/status --------------------------------------------------', () => {
    it('대회 상태 수정 INACTIVE -> ACTIVE 성공 시', async () => {
      const competition = new CompetitionDummyBuilder()
        .setTitle('dummy competition')
        .setIsPartnership(true)
        .setCompetitionDates(new Date())
        .build();
      await entityEntityManager.save(CompetitionEntity, competition);
      const res = await request(app.getHttpServer())
        .patch(`/admin/competitions/${competition.id}/status`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ status: 'ACTIVE' });
      expect(typia.is<ResponseForm<UpdateCompetitionRes>>(res.body)).toBe(true);
    });

    it('대회 상태 수정 INACTIVE -> ACTIVE 실패 시', async () => {
      const competition = new CompetitionDummyBuilder()
        .setTitle('dummy competition')
        .setIsPartnership(true)
        .setStatus('INACTIVE')
        .build();
      competition.competitionDate = null;
      competition.registrationStartDate = null;
      competition.registrationEndDate = null;
      competition.refundDeadlineDate = null;
      await entityEntityManager.save(CompetitionEntity, competition);
      const res = await request(app.getHttpServer())
        .patch(`/admin/competitions/${competition.id}/status`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ status: 'ACTIVE' });
      expect(typia.is<COMPETITIONS_COMPETITION_STATUS_CANNOT_BE_ACTIVE>(res.body)).toBe(true);
    });

    it('대회 상태 수정 ACTIVE -> INACTIVE 성공 시', async () => {
      const competition = new CompetitionDummyBuilder()
        .setTitle('dummy competition')
        .setIsPartnership(true)
        .setCompetitionDates(new Date())
        .setStatus('ACTIVE')
        .build();
      await entityEntityManager.save(CompetitionEntity, competition);
      const res = await request(app.getHttpServer())
        .patch(`/admin/competitions/${competition.id}/status`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ status: 'INACTIVE' });
      expect(typia.is<ResponseForm<UpdateCompetitionRes>>(res.body)).toBe(true);
    });
  });

  describe('a-5-6 POST /admin/competitions/:competitionId/divisions ------------------------------------------------', () => {
    it('대회 부문 생성하기 성공 시', async () => {
      const competition = new CompetitionDummyBuilder()
        .setTitle('dummy competition')
        .setIsPartnership(true)
        .setCompetitionDates(new Date())
        .build();
      await entityEntityManager.save(CompetitionEntity, competition);
      const divisionPacks = generateDummyDivisionPacks();
      const res = await request(app.getHttpServer())
        .post(`/admin/competitions/${competition.id}/divisions`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ divisionPacks });
      expect(typia.is<ResponseForm<CreateDivisionsRes>>(res.body)).toBe(true);
    });
  });

  describe('a-5-7 POST /admin/competitions/:competitionId/earlybird-discount-snapshots -----------------------------', () => {
    it('대회 얼리버드 할인 스냅샷 생성하기 성공 시', async () => {
      const competition = new CompetitionDummyBuilder()
        .setTitle('dummy competition')
        .setIsPartnership(true)
        .setCompetitionDates(new Date())
        .build();
      await entityEntityManager.save(CompetitionEntity, competition);
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
    });
  });

  describe('a-5-8 POST /admin/competitions/:competitionId/combination-discount-snapshots ---------------------------', () => {
    it('대회 조합 할인 스냅샷 생성하기 성공 시', async () => {
      const competition = new CompetitionDummyBuilder()
        .setTitle('dummy competition')
        .setIsPartnership(true)
        .setCompetitionDates(new Date())
        .build();
      await entityEntityManager.save(CompetitionEntity, competition);
      const createCombinationDiscountSnapshotReqBody: CreateCombinationDiscountSnapshotReqBody = {
        combinationDiscountRules: dummyCombinationDiscountRules,
      };
      const res = await request(app.getHttpServer())
        .post(`/admin/competitions/${competition.id}/combination-discount-snapshots`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(createCombinationDiscountSnapshotReqBody);
      expect(typia.is<ResponseForm<CreateCombinationDiscountSnapshotRes>>(res.body)).toBe(true);
    });
  });

  describe('a-5-9 POST /admin/competitions/:competitionId/required-additional-infos --------------------------------', () => {
    it('대회 필수 추가 정보 생성하기 성공 시', async () => {
      const competition = new CompetitionDummyBuilder()
        .setTitle('dummy competition')
        .setIsPartnership(true)
        .setCompetitionDates(new Date())
        .build();
      await entityEntityManager.save(CompetitionEntity, competition);
      const createRequiredAdditionalInfoReqBody: CreateRequiredAdditionalInfoReqBody = {
        type: 'ADDRESS',
        description: '주소',
      };
      const res = await request(app.getHttpServer())
        .post(`/admin/competitions/${competition.id}/required-additional-infos`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(createRequiredAdditionalInfoReqBody);
      expect(typia.is<ResponseForm<CreateRequiredAdditionalInfoRet>>(res.body)).toBe(true);
    });
  });

  describe('a-5-10 PATCH /admin/competitions/:competitionId/required-additional-infos/:requiredAdditionalInfoId ----', () => {
    it('대회 필수 추가 정보 수정하기 성공 시', async () => {
      const competition = new CompetitionDummyBuilder()
        .setTitle('dummy competition')
        .setIsPartnership(true)
        .setCompetitionDates(new Date())
        .build();
      const requiredAdditionalInfo: IRequiredAdditionalInfo = {
        id: ulid(),
        type: 'ADDRESS',
        description: '주소',
        competitionId: competition.id,
        createdAt: new Date(),
      };
      await entityEntityManager.save(CompetitionEntity, competition);
      await entityEntityManager.save(RequiredAdditionalInfoEntity, requiredAdditionalInfo);
      const updateRequiredAdditionalInfoReqBody: UpdateRequiredAdditionalInfoReqBody = {
        description: 'updated description',
      };
      const res = await request(app.getHttpServer())
        .patch(`/admin/competitions/${competition.id}/required-additional-infos/${requiredAdditionalInfo.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateRequiredAdditionalInfoReqBody);
      expect(typia.is<ResponseForm<CreateRequiredAdditionalInfoRet>>(res.body)).toBe(true);
      expect(res.body.result.requiredAdditionalInfo.description).toBe(updateRequiredAdditionalInfoReqBody.description);
    });
  });

  describe('a-5-11 DELETE /admin/competitions/:competitionId/required-additional-infos/:requiredAdditionalInfoId ---', () => {
    it('대회 필수 추가 정보 삭제하기 성공 시', async () => {
      const competition = new CompetitionDummyBuilder()
        .setTitle('dummy competition')
        .setIsPartnership(true)
        .setCompetitionDates(new Date())
        .build();
      const requiredAdditionalInfo: IRequiredAdditionalInfo = {
        id: ulid(),
        type: 'ADDRESS',
        description: '주소',
        competitionId: competition.id,
        createdAt: new Date(),
      };
      await entityEntityManager.save(CompetitionEntity, competition);
      await entityEntityManager.save(RequiredAdditionalInfoEntity, requiredAdditionalInfo);
      const res = await request(app.getHttpServer())
        .delete(`/admin/competitions/${competition.id}/required-additional-infos/${requiredAdditionalInfo.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      expect(typia.is<ResponseForm<CreateRequiredAdditionalInfoRet>>(res.body)).toBe(true);
      const deletedRequiredAdditionalInfo = await entityEntityManager.findOne(RequiredAdditionalInfoEntity, {
        where: { id: requiredAdditionalInfo.id },
      });
      expect(deletedRequiredAdditionalInfo).toBe(null);
    });
  });
});
