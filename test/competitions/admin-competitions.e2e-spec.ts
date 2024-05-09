import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import typia from 'typia';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import appEnv from '../../src/common/app-env';
import { ResponseForm } from 'src/common/response/response';
import { EntityManager, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import {
  COMPETITIONS_COMPETITION_STATUS_CANNOT_BE_ACTIVE,
  REGISTER_NICKNAME_DUPLICATED,
  REGISTER_PHONE_NUMBER_REQUIRED,
  REGISTER_POLICY_CONSENT_REQUIRED,
} from 'src/common/response/errorResponse';
import { UsersAppService } from 'src/modules/users/application/users.app.service';
import { PolicyAppService } from 'src/modules/policy/application/policy.app.service';
import { IPolicy } from 'src/modules/policy/domain/interface/policy.interface';
import { ITemporaryUser, IUser } from 'src/modules/users/domain/interface/user.interface';
import {
  ConfirmAuthCodeRes,
  GetTemporaryUserRes,
  IsDuplicatedNicknameRes,
  RegisterUserRes,
  SendPhoneNumberAuthCodeRes,
} from 'src/modules/register/presentation/dtos';
import { UserEntity } from 'src/infrastructure/database/entity/user/user.entity';
import { ulid } from 'ulid';
import {
  CreateCompetitionReqBody,
  CreateCompetitionRes,
  FindCompetitionsRes,
  GetCompetitionRes,
  UpdateCompetitionRes,
} from 'src/modules/competitions/presentation/dtos';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { generateDummyCompetition } from '../../src/competitions-dummy';
import { CompetitionEntity } from 'src/infrastructure/database/entity/competition/competition.entity';
import { UserDummyBuilder } from 'src/dummy/user-dummy';
import { generateDummyCompetitions } from 'src/dummy/competition-dummy';

const competition: ICompetition = {
  id: ulid(),
  title: 'dummy competition',
  address: '서울',
  isPartnership: false,
  description: '대회 설명',
  status: 'ACTIVE',
  viewCount: 0,
  posterImgUrlKey: null,
  competitionDate: null,
  registrationStartDate: null,
  registrationEndDate: null,
  refundDeadlineDate: null,
  soloRegistrationAdjustmentStartDate: null,
  soloRegistrationAdjustmentEndDate: null,
  registrationListOpenDate: null,
  bracketOpenDate: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('E2E u-5 competitions TEST', () => {
  let app: INestApplication;
  let testingModule: TestingModule;
  let entityEntityManager: EntityManager;
  let tableNames: string;
  let redisClient: Redis;
  let jwtService: JwtService;
  let usersAppService: UsersAppService;
  let policyAppService: PolicyAppService;
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
    usersAppService = testingModule.get<UsersAppService>(UsersAppService);
    policyAppService = testingModule.get<PolicyAppService>(PolicyAppService);
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

  describe('더미 대회 생성하기 -----------------------------------------------------', () => {
    const competitions = generateDummyCompetitions();
    console.log(competitions);
  });

  describe('a-5-1 POST /admin/competitions -----------------------------------------------------', () => {
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

  describe('a-5-2 GET /admin/competitions -----------------------------------------------------', () => {
    it('대회 조회하기 성공 시', async () => {
      const competitions = generateDummyCompetitions();
      await entityEntityManager.save(CompetitionEntity, competitions);
      const res = await request(app.getHttpServer())
        .get('/admin/competitions')
        .set('Authorization', `Bearer ${adminAccessToken}`);
      expect(typia.is<ResponseForm<FindCompetitionsRes>>(res.body)).toBe(true);
    });
  });

  describe('a-5-3 GET /admin/competitions/:competitionId -----------------------------------------------------', () => {
    it('대회 조회하기 성공 시', async () => {
      const competition = generateDummyCompetition();
      await entityEntityManager.save(CompetitionEntity, competition);
      const res = await request(app.getHttpServer())
        .get(`/admin/competitions/${competition.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      expect(typia.is<ResponseForm<GetCompetitionRes>>(res.body)).toBe(true);
    });
  });

  describe('a-5-4 PATCH /admin/competitions/:competitionId -----------------------------------------------------', () => {
    it('대회 수정하기 성공 시', async () => {
      const competition = generateDummyCompetition();
      await entityEntityManager.save(CompetitionEntity, competition);
      const res = await request(app.getHttpServer())
        .patch(`/admin/competitions/${competition.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ title: '수정된 대회' });
      expect(typia.is<ResponseForm<UpdateCompetitionRes>>(res.body)).toBe(true);
    });
  });

  describe('a-5-5 PATCH /admin/competitions/:competitionId/status -----------------------------------------------------', () => {
    it('대회 상태 수정 INACTIVE -> ACTIVE 성공 시', async () => {
      const competition = generateDummyCompetition();
      await entityEntityManager.save(CompetitionEntity, competition);
      const res = await request(app.getHttpServer())
        .patch(`/admin/competitions/${competition.id}/status`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ status: 'ACTIVE' });
      expect(typia.is<ResponseForm<UpdateCompetitionRes>>(res.body)).toBe(true);
    });

    it('대회 상태 수정 INACTIVE -> ACTIVE 실패 시', async () => {
      const competition = generateDummyCompetition();
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
      const competition = generateDummyCompetition();
      await entityEntityManager.save(CompetitionEntity, competition);
      const res = await request(app.getHttpServer())
        .patch(`/admin/competitions/${competition.id}/status`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ status: 'INACTIVE' });
      expect(typia.is<ResponseForm<UpdateCompetitionRes>>(res.body)).toBe(true);
    });
  });

  describe('a-5-6 POST /admin/competitions/:competitionId/divisions -----------------------------------------------------', () => {
    it('대회 부문 생성하기 성공 시', async () => {
      const competition = generateDummyCompetition();
      await entityEntityManager.save(CompetitionEntity, competition);
      // const divisionPacks =
    });
  });
});
