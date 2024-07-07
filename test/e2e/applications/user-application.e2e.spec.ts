import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import typia from 'typia';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import appEnv from '../../../src/common/app-env';
import { ResponseForm } from '../../../src/common/response/response';
import { EntityManager } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import { UserEntity } from '../../../src/database/entity/user/user.entity';
import { CompetitionEntity } from '../../../src/database/entity/competition/competition.entity';
import { UserDummyBuilder } from '../../../src/dummy/user.dummy';
import { CompetitionDummyBuilder, getCompetitionDateByStatus } from '../../../src/dummy/competition.dummy';
import { generateDummyDivisionPacks } from '../../../src/dummy/division.dummy';
import { dummyCombinationDiscountRules } from '../../../src/dummy/combination-discount-snapshot.dummy';
import { IUser } from '../../../src/modules/users/domain/interface/user.interface';
import { ICompetition } from '../../../src/modules/competitions/domain/interface/competition.interface';
import { IParticipationDivisionCombination } from '../../../src/dummy/application.dummy';
import { IDivision } from '../../../src/modules/competitions/domain/interface/division.interface';
import {
  ApproveApplicationOrderReqBody,
  ApproveApplicationOrderRes,
  CancelApplicationOrderReqBody,
  CancelApplicationOrderRes,
  CreateApplicationOrderRes,
  CreateApplicationReqBody,
  CreateApplicationRes,
  GetApplicationRes,
  UpdateDoneApplicationReqBody,
  UpdateReadyApplicationReqBody,
  UpdateReadyApplicationRes,
} from '../../../src/modules/applications/presentation/applications.controller.dto';
import {
  APPLICATIONS_DIVISION_AGE_NOT_MATCH,
  APPLICATIONS_DIVISION_GENDER_NOT_MATCH,
  APPLICATIONS_ORDRE_PAYMENT_AMOUNT_NOT_MATCH,
  APPLICATIONS_REGISTRATION_ENDED,
  APPLICATIONS_REGISTRATION_NOT_STARTED,
  APPLICATIONS_REQUIRED_ADDITIONAL_INFO_NOT_MATCH,
  ENTITY_NOT_FOUND,
} from '../../../src/common/response/errorResponse';
import { ITossCardPayment } from 'toss-payments-server-api/lib/structures/ITossCardPayment';
import toss from 'toss-payments-server-api';
import { PaymentsAppService } from '../../../src/modules/payments/application/payments.app.service';
import exp from 'constants';
import { competition } from '../../../src/api/functional/user/view_count';

const extractDivisionIds = (
  competition: ICompetition,
  participationDivisionCombination: IParticipationDivisionCombination,
): IDivision['id'][] => {
  return participationDivisionCombination.map((unit) => {
    const [category, uniform, gender, belt, weight] = unit;
    const matchDivision = competition.divisions.find(
      (division) =>
        division.category === category &&
        division.uniform === uniform &&
        division.gender === gender &&
        division.belt === belt &&
        division.weight === weight,
    );
    if (!matchDivision) throw new Error(`Division not found: ${unit}`);
    return matchDivision.id;
  });
};

describe('E2E u-6 applications TEST', () => {
  let app: INestApplication;
  let testingModule: TestingModule;
  let entityEntityManager: EntityManager;
  let tableNames: string;
  let redisClient: Redis;
  let jwtService: JwtService;
  let adminAccessToken: string;
  let paymentsAppService: PaymentsAppService;

  let dummyAdmin: IUser;
  let dummyUser: IUser;
  let dummyAdminAccessToken: string;
  let dummyUserAccessToken: string;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    entityEntityManager = testingModule.get<EntityManager>(EntityManager);
    tableNames = entityEntityManager.connection.entityMetadatas.map((entity) => `"${entity.tableName}"`).join(', ');
    redisClient = testingModule.get<Redis>('REDIS_CLIENT');
    jwtService = testingModule.get<JwtService>(JwtService);
    paymentsAppService = testingModule.get<PaymentsAppService>(PaymentsAppService);

    (await app.init()).listen(appEnv.appPort);

    dummyAdmin = new UserDummyBuilder().setRole('ADMIN').build();
    dummyUser = new UserDummyBuilder().setRole('USER').build();
    dummyAdminAccessToken = jwtService.sign(
      { userId: dummyAdmin.id, userRole: dummyAdmin.role },
      { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
    );
    dummyUserAccessToken = jwtService.sign(
      { userId: dummyUser.id, userRole: dummyUser.role },
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

  describe('u-6-1 createApplication', () => {
    it('신청 성공', async () => {
      /** pre condition */
      const dummyCompetition = new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle('테스트 대회')
        .setCompetitionBasicDates(
          getCompetitionDateByStatus(
            '신청기간 중, 환불기간 중, 단독출전조정기간 전, 출전명단공개 전, 대진표공개 전 / 얼리버드할인기간 중',
          ),
        )
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .setCompetitionHostMaps([dummyAdmin.id])
        .build();
      await entityEntityManager.save(UserEntity, [dummyAdmin, dummyUser]);
      await entityEntityManager.save(CompetitionEntity, dummyCompetition);
      const participationDivisionCombination: IParticipationDivisionCombination = [
        ['어덜트', 'GI', 'MALE', '화이트', '-58'],
        ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
        ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
        ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
      ];

      /** main test */
      const createApplicationReqBody: CreateApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, participationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      const createApplicationResBody = await request(app.getHttpServer())
        .post('/user/applications')
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(createApplicationReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationRes>>(res.body);
        });
    });

    it('신청 실패 - 대회 신청 기간 시작 전', async () => {
      /** pre condition */
      const dummyCompetition = new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle('테스트 대회')
        .setCompetitionBasicDates(
          getCompetitionDateByStatus('신청기간 전, 환불기간 전, 단독출전조정기간 전, 출전명단공개 전, 대진표공개 전'),
        )
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .setCompetitionHostMaps([dummyAdmin.id])
        .build();
      await entityEntityManager.save(UserEntity, [dummyAdmin, dummyUser]);
      await entityEntityManager.save(CompetitionEntity, dummyCompetition);
      const participationDivisionCombination: IParticipationDivisionCombination = [
        ['어덜트', 'GI', 'MALE', '화이트', '-58'],
        ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
        ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
        ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
      ];

      /** main test */
      const createApplicationReqBody: CreateApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, participationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      const createApplicationResBody = await request(app.getHttpServer())
        .post('/user/applications')
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(createApplicationReqBody)
        .then((res) => {
          return typia.assert<APPLICATIONS_REGISTRATION_NOT_STARTED>(res.body);
        });
    });

    it('신청 실패 - 대회 신청 기간 종료', async () => {
      /** pre condition */
      const dummyCompetition = new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle('테스트 대회')
        .setCompetitionBasicDates(
          getCompetitionDateByStatus('신청기간 후, 환불기간 후, 단독출전조정기간 후, 출전명단공개 후, 대진표공개 후'),
        )
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .setCompetitionHostMaps([dummyAdmin.id])
        .build();
      await entityEntityManager.save(UserEntity, [dummyAdmin, dummyUser]);
      await entityEntityManager.save(CompetitionEntity, dummyCompetition);
      const participationDivisionCombination: IParticipationDivisionCombination = [
        ['어덜트', 'GI', 'MALE', '화이트', '-58'],
        ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
        ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
        ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
      ];

      /** main test */
      const createApplicationReqBody: CreateApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, participationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      const createApplicationResBody = await request(app.getHttpServer())
        .post('/user/applications')
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(createApplicationReqBody)
        .then((res) => {
          return typia.assert<APPLICATIONS_REGISTRATION_ENDED>(res.body);
        });
    });

    it('todo!!! 신청 실패 - 단독 출전 조정 기간중, 출전 인원 0명 부문에 신청', async () => {});

    it('신청 실패 - 선수 정보와 맞지 않는 부문 성별', async () => {
      /** pre condition */
      const dummyCompetition = new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle('테스트 대회')
        .setCompetitionBasicDates(
          getCompetitionDateByStatus(
            '신청기간 중, 환불기간 중, 단독출전조정기간 전, 출전명단공개 전, 대진표공개 전 / 얼리버드할인기간 중',
          ),
        )
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .setCompetitionHostMaps([dummyAdmin.id])
        .build();
      await entityEntityManager.save(UserEntity, [dummyAdmin, dummyUser]);
      await entityEntityManager.save(CompetitionEntity, dummyCompetition);
      const participationDivisionCombination: IParticipationDivisionCombination = [
        ['어덜트', 'GI', 'FEMALE', '화이트', '-43'],
        ['어덜트', 'GI', 'FEMALE', '화이트', '-58_ABSOLUTE'],
        ['노기통합', 'NOGI', 'FEMALE', '초급', '-45'],
        ['노기통합', 'NOGI', 'FEMALE', '초급', 'ABSOLUTE'],
      ];

      /** main test */
      const createApplicationReqBody: CreateApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, participationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      const createApplicationResBody = await request(app.getHttpServer())
        .post('/user/applications')
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(createApplicationReqBody)
        .then((res) => {
          return typia.assert<APPLICATIONS_DIVISION_GENDER_NOT_MATCH>(res.body);
        });
    });

    it('신청 실패 - 선수 정보와 맞지 않는 부문 나이', async () => {
      /** pre condition */
      const dummyCompetition = new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle('테스트 대회')
        .setCompetitionBasicDates(
          getCompetitionDateByStatus(
            '신청기간 중, 환불기간 중, 단독출전조정기간 전, 출전명단공개 전, 대진표공개 전 / 얼리버드할인기간 중',
          ),
        )
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .setCompetitionHostMaps([dummyAdmin.id])
        .build();
      await entityEntityManager.save(UserEntity, [dummyAdmin, dummyUser]);
      await entityEntityManager.save(CompetitionEntity, dummyCompetition);
      const participationDivisionCombination: IParticipationDivisionCombination = [
        ['초등부34', 'GI', 'MALE', '화이트', '-25'],
        ['초등부34', 'GI', 'MALE', '유색', '-25'],
      ];

      /** main test */
      const createApplicationReqBody: CreateApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, participationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      const createApplicationResBody = await request(app.getHttpServer())
        .post('/user/applications')
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(createApplicationReqBody)
        .then((res) => {
          return typia.assert<APPLICATIONS_DIVISION_AGE_NOT_MATCH>(res.body);
        });
    });

    it('신청 실패 - 필수 추가 정보 누락', async () => {
      /** pre condition */
      const dummyCompetition = new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle('테스트 대회')
        .setCompetitionBasicDates(
          getCompetitionDateByStatus(
            '신청기간 중, 환불기간 중, 단독출전조정기간 전, 출전명단공개 전, 대진표공개 전 / 얼리버드할인기간 중',
          ),
        )
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .setCompetitionHostMaps([dummyAdmin.id])
        .build();
      await entityEntityManager.save(UserEntity, [dummyAdmin, dummyUser]);
      await entityEntityManager.save(CompetitionEntity, dummyCompetition);
      const participationDivisionCombination: IParticipationDivisionCombination = [
        ['어덜트', 'GI', 'MALE', '화이트', '-58'],
        ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
        ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
        ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
      ];

      /** main test */
      const createApplicationReqBody: CreateApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, participationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [],
      };
      const createApplicationResBody = await request(app.getHttpServer())
        .post('/user/applications')
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(createApplicationReqBody)
        .then((res) => {
          return typia.assert<APPLICATIONS_REQUIRED_ADDITIONAL_INFO_NOT_MATCH>(res.body);
        });
    });
  });

  describe('u-6-2 getApplication', () => {
    it('신청 조회 성공', async () => {
      /** pre condition */
      const dummyCompetition = new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle('테스트 대회')
        .setCompetitionBasicDates(
          getCompetitionDateByStatus(
            '신청기간 중, 환불기간 중, 단독출전조정기간 전, 출전명단공개 전, 대진표공개 전 / 얼리버드할인기간 중',
          ),
        )
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .setCompetitionHostMaps([dummyAdmin.id])
        .build();
      await entityEntityManager.save(UserEntity, [dummyAdmin, dummyUser]);
      await entityEntityManager.save(CompetitionEntity, dummyCompetition);
      const participationDivisionCombination: IParticipationDivisionCombination = [
        ['어덜트', 'GI', 'MALE', '화이트', '-58'],
        ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
        ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
        ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
      ];
      const createApplicationReqBody: CreateApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, participationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      const createApplicationResBody = await request(app.getHttpServer())
        .post('/user/applications')
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(createApplicationReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationRes>>(res.body);
        });
      const applicationId = createApplicationResBody.result.application.id;

      /** main test */
      const getApplicationResBody = await request(app.getHttpServer())
        .get(`/user/applications/${applicationId}`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<GetApplicationRes>>(res.body);
        });
    });
  });

  describe('u-6-3 updateReadyApplication', () => {
    it('READY(결제전) 신청 수정 성공', async () => {
      /** pre condition */
      const dummyCompetition = new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle('테스트 대회')
        .setCompetitionBasicDates(
          getCompetitionDateByStatus(
            '신청기간 중, 환불기간 중, 단독출전조정기간 전, 출전명단공개 전, 대진표공개 전 / 얼리버드할인기간 중',
          ),
        )
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .setCompetitionHostMaps([dummyAdmin.id])
        .build();
      await entityEntityManager.save(UserEntity, [dummyAdmin, dummyUser]);
      await entityEntityManager.save(CompetitionEntity, dummyCompetition);
      const participationDivisionCombination: IParticipationDivisionCombination = [
        ['어덜트', 'GI', 'MALE', '화이트', '-58'],
        ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
        ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
        ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
      ];
      const createApplicationBody: CreateApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, participationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      const createApplicationResBody = await request(app.getHttpServer())
        .post('/user/applications')
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(createApplicationBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationRes>>(res.body);
        });
      const applicationId = createApplicationResBody.result.application.id;

      /** main test */
      const updateApplicationBody: UpdateReadyApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, participationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      const updateApplicationResBody = await request(app.getHttpServer())
        .patch(`/user/applications/${applicationId}/ready`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(updateApplicationBody)
        .then((res) => {
          return typia.assert<ResponseForm<UpdateReadyApplicationRes>>(res.body);
        });
    });

    it('READY(결제전) 신청 수정 실패 - 대회 신청 기간 종료', async () => {
      /** pre condition */
      const dummyCompetition = new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle('테스트 대회')
        .setCompetitionBasicDates(
          getCompetitionDateByStatus('신청기간 중, 환불기간 중, 단독출전조정기간 전, 출전명단공개 전, 대진표공개 전'),
        )
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .setCompetitionHostMaps([dummyAdmin.id])
        .build();
      await entityEntityManager.save(UserEntity, [dummyAdmin, dummyUser]);
      await entityEntityManager.save(CompetitionEntity, dummyCompetition);
      const participationDivisionCombination: IParticipationDivisionCombination = [
        ['어덜트', 'GI', 'MALE', '화이트', '-58'],
        ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
        ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
        ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
      ];
      const createApplicationBody: CreateApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, participationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      const createApplicationResBody = await request(app.getHttpServer())
        .post('/user/applications')
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(createApplicationBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationRes>>(res.body);
        });
      const applicationId = createApplicationResBody.result.application.id;
      await entityEntityManager.update(CompetitionEntity, dummyCompetition.id, {
        registrationEndDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      });

      /** main test */
      const updateApplicationBody: UpdateReadyApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, participationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      const updateApplicationResBody = await request(app.getHttpServer())
        .patch(`/user/applications/${applicationId}/ready`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(updateApplicationBody)
        .then((res) => {
          return typia.assert<APPLICATIONS_REGISTRATION_ENDED>(res.body);
        });
    });

    it('todo!!! READY(결제전) 신청 수정 실패 - 단독 출전 조정 기간중, 출전 인원 0명 부문으로 수정', async () => {});

    it('READY(결제전) 신청 수정 실패 - 선수 정보와 맞지 않는 부문 성별', async () => {
      /** pre condition */
      const dummyCompetition = new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle('테스트 대회')
        .setCompetitionBasicDates(
          getCompetitionDateByStatus(
            '신청기간 중, 환불기간 중, 단독출전조정기간 전, 출전명단공개 전, 대진표공개 전 / 얼리버드할인기간 중',
          ),
        )
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .setCompetitionHostMaps([dummyAdmin.id])
        .build();
      await entityEntityManager.save(UserEntity, [dummyAdmin, dummyUser]);
      await entityEntityManager.save(CompetitionEntity, dummyCompetition);
      const participationDivisionCombination: IParticipationDivisionCombination = [
        ['어덜트', 'GI', 'MALE', '화이트', '-58'],
        ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
        ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
        ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
      ];
      const createApplicationBody: CreateApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, participationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      const createApplicationResBody = await request(app.getHttpServer())
        .post('/user/applications')
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(createApplicationBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationRes>>(res.body);
        });
      const applicationId = createApplicationResBody.result.application.id;

      /** main test */
      const newParticipationDivisionCombination: IParticipationDivisionCombination = [
        ['어덜트', 'GI', 'FEMALE', '화이트', '-43'],
        ['어덜트', 'GI', 'FEMALE', '화이트', '-58_ABSOLUTE'],
        ['노기통합', 'NOGI', 'FEMALE', '초급', '-45'],
        ['노기통합', 'NOGI', 'FEMALE', '초급', 'ABSOLUTE'],
      ];
      const updateApplicationBody: UpdateReadyApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, newParticipationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      const updateApplicationResBody = await request(app.getHttpServer())
        .patch(`/user/applications/${applicationId}/ready`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(updateApplicationBody)
        .then((res) => {
          return typia.assert<APPLICATIONS_DIVISION_GENDER_NOT_MATCH>(res.body);
        });
    });

    it('READY(결제전) 신청 수정 실패 - 선수 정보와 맞지 않는 부문 나이', async () => {
      /** pre condition */
      const dummyCompetition = new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle('테스트 대회')
        .setCompetitionBasicDates(
          getCompetitionDateByStatus(
            '신청기간 중, 환불기간 중, 단독출전조정기간 전, 출전명단공개 전, 대진표공개 전 / 얼리버드할인기간 중',
          ),
        )
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .setCompetitionHostMaps([dummyAdmin.id])
        .build();
      await entityEntityManager.save(UserEntity, [dummyAdmin, dummyUser]);
      await entityEntityManager.save(CompetitionEntity, dummyCompetition);
      const participationDivisionCombination: IParticipationDivisionCombination = [
        ['어덜트', 'GI', 'MALE', '화이트', '-58'],
        ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
        ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
        ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
      ];
      const createApplicationBody: CreateApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, participationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      const createApplicationResBody = await request(app.getHttpServer())
        .post('/user/applications')
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(createApplicationBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationRes>>(res.body);
        });
      const applicationId = createApplicationResBody.result.application.id;

      /** main test */
      const newParticipationDivisionCombination: IParticipationDivisionCombination = [
        ['초등부34', 'GI', 'MALE', '화이트', '-25'],
        ['초등부34', 'GI', 'MALE', '유색', '-25'],
      ];
      const updateApplicationBody: UpdateReadyApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, newParticipationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      const updateApplicationResBody = await request(app.getHttpServer())
        .patch(`/user/applications/${applicationId}/ready`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(updateApplicationBody)
        .then((res) => {
          return typia.assert<APPLICATIONS_DIVISION_AGE_NOT_MATCH>(res.body);
        });
    });
  });

  describe('u-6-4 updateDoneApplication', () => {
    it('todo!!! DONE(결제완료) 신청 수정 성공', async () => {});

    it('todo!!! DONE(결제완료) 신청 수정 실패 - 대회 신청 기간 종료', async () => {});

    it('todo!!! DONE(결제완료) 신청 수정 실패 - 단독 출전 조정 기간중, 출전 인원 0명 부문으로 수정', async () => {});

    it('todo!!! DONE(결제완료) 신청 수정 실패 - 선수 정보와 맞지 않는 부문 성별', async () => {});

    it('todo!!! DONE(결제완료) 신청 수정 실패 - 선수 정보와 맞지 않는 부문 나이', async () => {});
  });

  describe('u-6-5 deleteApplication', () => {
    it('todo!!! 신청 삭제 성공', async () => {});
  });

  describe('u-6-6 getExpectedPayment @Deprecated', () => {});

  describe('u-6-7 findApplications', () => {
    it('todo!!! 신청 목록 조회 성공', async () => {});
  });

  describe('u-6-8 createApplicationOrder', () => {
    it('결제 주문 생성 성공', async () => {
      /** pre condition */
      const dummyCompetition = new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle('테스트 대회')
        .setCompetitionBasicDates(
          getCompetitionDateByStatus(
            '신청기간 중, 환불기간 중, 단독출전조정기간 전, 출전명단공개 전, 대진표공개 전 / 얼리버드할인기간 중',
          ),
        )
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .setCompetitionHostMaps([dummyAdmin.id])
        .build();
      await entityEntityManager.save(UserEntity, [dummyAdmin, dummyUser]);
      await entityEntityManager.save(CompetitionEntity, dummyCompetition);
      const participationDivisionCombination: IParticipationDivisionCombination = [
        ['어덜트', 'GI', 'MALE', '화이트', '-58'],
        ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
        ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
        ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
      ];
      const createApplicationReqBody: CreateApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, participationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      const createApplicationResBody = await request(app.getHttpServer())
        .post('/user/applications')
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(createApplicationReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationRes>>(res.body);
        });
      const applicationId = createApplicationResBody.result.application.id;
      /** main test */
      const createApplicationOrderResBody = await request(app.getHttpServer())
        .post(`/user/applications/${applicationId}/order`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationOrderRes>>(res.body);
        });
    });

    it('결제 주문 생성 실패 - 대회 신청 기간 종료', async () => {
      /** pre condition */
      const dummyCompetition = new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle('테스트 대회')
        .setCompetitionBasicDates(
          getCompetitionDateByStatus(
            '신청기간 중, 환불기간 중, 단독출전조정기간 전, 출전명단공개 전, 대진표공개 전 / 얼리버드할인기간 중',
          ),
        )
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .setCompetitionHostMaps([dummyAdmin.id])
        .build();
      await entityEntityManager.save(UserEntity, [dummyAdmin, dummyUser]);
      await entityEntityManager.save(CompetitionEntity, dummyCompetition);
      const participationDivisionCombination: IParticipationDivisionCombination = [
        ['어덜트', 'GI', 'MALE', '화이트', '-58'],
        ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
        ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
        ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
      ];
      const createApplicationReqBody: CreateApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, participationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      const createApplicationResBody = await request(app.getHttpServer())
        .post('/user/applications')
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(createApplicationReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationRes>>(res.body);
        });
      await entityEntityManager.update(CompetitionEntity, dummyCompetition.id, {
        registrationEndDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      });
      const applicationId = createApplicationResBody.result.application.id;
      /** main test */
      const createApplicationOrderResBody = await request(app.getHttpServer())
        .post(`/user/applications/${applicationId}/order`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .then((res) => {
          return typia.assert<APPLICATIONS_REGISTRATION_ENDED>(res.body);
        });
    });

    it('todo!!! 결제 주문 생성 실패 - 단독 출전 조정 기간중, 출전 인원 0명 부문을 포함한 신청에 대한 주문 생성', async () => {});
  });

  describe('u-6-9 approveApplicationOrder', () => {
    it('결제 주문 승인 성공', async () => {
      /** pre condition */
      // dummy data
      const dummyCompetition = new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle('테스트 대회')
        .setCompetitionBasicDates(
          getCompetitionDateByStatus(
            '신청기간 중, 환불기간 중, 단독출전조정기간 전, 출전명단공개 전, 대진표공개 전 / 얼리버드할인기간 중',
          ),
        )
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .setCompetitionHostMaps([dummyAdmin.id])
        .build();
      await entityEntityManager.save(UserEntity, [dummyAdmin, dummyUser]);
      await entityEntityManager.save(CompetitionEntity, dummyCompetition);
      const participationDivisionCombination: IParticipationDivisionCombination = [
        ['어덜트', 'GI', 'MALE', '화이트', '-58'],
        ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
        ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
        ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
      ];
      const createApplicationReqBody: CreateApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, participationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      // application 생성
      const createApplicationResBody = await request(app.getHttpServer())
        .post('/user/applications')
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(createApplicationReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationRes>>(res.body);
        });
      const applicationId = createApplicationResBody.result.application.id;

      // application order 생성
      const createApplicationOrderResBody = await request(app.getHttpServer())
        .post(`/user/applications/${applicationId}/order`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationOrderRes>>(res.body);
        });
      const applicationOrders = createApplicationOrderResBody.result.application.applicationOrders;
      if (!applicationOrders) throw new Error('applicationOrders is not exist in application');

      // tosspayment-sdk 위젯에서 결제 요청 동장 시뮬레이션
      const { orderId, orderName, customerName, customerEmail } = applicationOrders[applicationOrders.length - 1];
      const amount =
        applicationOrders[applicationOrders.length - 1].applicationOrderPaymentSnapshots[applicationOrders.length - 1]
          .totalAmount;
      const keyInRet = await paymentsAppService.keyIn({
        method: 'card',
        cardNumber: '1111222233334444',
        cardExpirationYear: (new Date().getFullYear() + 1).toString().slice(-2),
        cardExpirationMonth: '04',
        orderId,
        orderName,
        customerEmail,
        amount: amount,
      });
      const payment = keyInRet.payment;

      /** main test */
      const approveApplicationOrderReqBody: ApproveApplicationOrderReqBody = {
        orderId,
        paymentKey: payment.paymentKey,
        amount: payment.totalAmount,
      };
      const approveApplicationOrderResBody = await request(app.getHttpServer())
        .post(`/user/applications/${applicationId}/order/approve`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(approveApplicationOrderReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<ApproveApplicationOrderRes>>(res.body);
        });
      const approvedApplication = approveApplicationOrderResBody.result.application;
      expect(approvedApplication.status).toBe('DONE');
      const approvedApplicationOrder = approvedApplication.applicationOrders?.find(
        (order) => order.orderId === orderId,
      );
      if (!approvedApplicationOrder) throw new Error('approvedApplicationOrder is not exist in applicationOrders');
      expect(approvedApplicationOrder.status).toBe('DONE');
      approvedApplicationOrder.applicationOrderPaymentSnapshots[0].participationDivisionInfoPayments.forEach(
        (participationDivisionInfoPayment) => {
          expect(participationDivisionInfoPayment.status).toBe('DONE');
        },
      );
      approvedApplication.participationDivisionInfos.forEach((participationDivisionInfo) => {
        expect(participationDivisionInfo.status).toBe('DONE');
      });
    });

    it('결제 주문 승인 실패 - 대회 신청 기간 종료', async () => {
      /** pre condition */
      // dummy data
      const dummyCompetition = new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle('테스트 대회')
        .setCompetitionBasicDates(
          getCompetitionDateByStatus(
            '신청기간 중, 환불기간 중, 단독출전조정기간 전, 출전명단공개 전, 대진표공개 전 / 얼리버드할인기간 중',
          ),
        )
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .setCompetitionHostMaps([dummyAdmin.id])
        .build();
      await entityEntityManager.save(UserEntity, [dummyAdmin, dummyUser]);
      await entityEntityManager.save(CompetitionEntity, dummyCompetition);
      const participationDivisionCombination: IParticipationDivisionCombination = [
        ['어덜트', 'GI', 'MALE', '화이트', '-58'],
        ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
        ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
        ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
      ];
      const createApplicationReqBody: CreateApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, participationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      // application 생성
      const createApplicationResBody = await request(app.getHttpServer())
        .post('/user/applications')
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(createApplicationReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationRes>>(res.body);
        });
      const applicationId = createApplicationResBody.result.application.id;

      // application order 생성
      const createApplicationOrderResBody = await request(app.getHttpServer())
        .post(`/user/applications/${applicationId}/order`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationOrderRes>>(res.body);
        });
      const applicationOrders = createApplicationOrderResBody.result.application.applicationOrders;
      if (!applicationOrders) throw new Error('applicationOrders is not exist in application');

      // tosspayment-sdk 위젯에서 결제 요청 동장 시뮬레이션
      const { orderId, orderName, customerName, customerEmail } = applicationOrders[applicationOrders.length - 1];
      const amount =
        applicationOrders[applicationOrders.length - 1].applicationOrderPaymentSnapshots[applicationOrders.length - 1]
          .totalAmount;
      const keyInRet = await paymentsAppService.keyIn({
        method: 'card',
        cardNumber: '1111222233334444',
        cardExpirationYear: (new Date().getFullYear() + 1).toString().slice(-2),
        cardExpirationMonth: '04',
        orderId,
        orderName,
        customerEmail,
        amount: amount - 1000,
      });
      const payment = keyInRet.payment;

      /** main test */
      await entityEntityManager.update(CompetitionEntity, dummyCompetition.id, {
        registrationEndDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      });

      const approveApplicationOrderReqBody: ApproveApplicationOrderReqBody = {
        orderId,
        paymentKey: payment.paymentKey,
        amount: payment.totalAmount,
      };
      const approveApplicationOrderResBody = await request(app.getHttpServer())
        .post(`/user/applications/${applicationId}/order/approve`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(approveApplicationOrderReqBody)
        .then((res) => {
          return typia.assert<APPLICATIONS_REGISTRATION_ENDED>(res.body);
        });
    });

    it('todo!!! 결제 주문 승인 실패 - 단독 출전 조정 기간중, 출전 인원 0명 부문을 포함한 신청에 대한 주문 승인', async () => {});

    it('결제 주문 승인 실패 - 결제 금액 불일치', async () => {
      /** pre condition */
      // dummy data
      const dummyCompetition = new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle('테스트 대회')
        .setCompetitionBasicDates(
          getCompetitionDateByStatus(
            '신청기간 중, 환불기간 중, 단독출전조정기간 전, 출전명단공개 전, 대진표공개 전 / 얼리버드할인기간 중',
          ),
        )
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .setCompetitionHostMaps([dummyAdmin.id])
        .build();
      await entityEntityManager.save(UserEntity, [dummyAdmin, dummyUser]);
      await entityEntityManager.save(CompetitionEntity, dummyCompetition);
      const participationDivisionCombination: IParticipationDivisionCombination = [
        ['어덜트', 'GI', 'MALE', '화이트', '-58'],
        ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
        ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
        ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
      ];
      const createApplicationReqBody: CreateApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, participationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      // application 생성
      const createApplicationResBody = await request(app.getHttpServer())
        .post('/user/applications')
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(createApplicationReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationRes>>(res.body);
        });
      const applicationId = createApplicationResBody.result.application.id;

      // application order 생성
      const createApplicationOrderResBody = await request(app.getHttpServer())
        .post(`/user/applications/${applicationId}/order`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationOrderRes>>(res.body);
        });
      const applicationOrders = createApplicationOrderResBody.result.application.applicationOrders;
      if (!applicationOrders) throw new Error('applicationOrders is not exist in application');

      // tosspayment-sdk 위젯에서 결제 요청 동장 시뮬레이션
      const { orderId, orderName, customerName, customerEmail } = applicationOrders[applicationOrders.length - 1];
      const amount =
        applicationOrders[applicationOrders.length - 1].applicationOrderPaymentSnapshots[applicationOrders.length - 1]
          .totalAmount;
      const keyInRet = await paymentsAppService.keyIn({
        method: 'card',
        cardNumber: '1111222233334444',
        cardExpirationYear: (new Date().getFullYear() + 1).toString().slice(-2),
        cardExpirationMonth: '04',
        orderId,
        orderName,
        customerEmail,
        amount: amount - 1000,
      });
      const payment = keyInRet.payment;

      /** main test */
      const approveApplicationOrderReqBody: ApproveApplicationOrderReqBody = {
        orderId,
        paymentKey: payment.paymentKey,
        amount: payment.totalAmount,
      };
      const approveApplicationOrderResBody = await request(app.getHttpServer())
        .post(`/user/applications/${applicationId}/order/approve`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(approveApplicationOrderReqBody)
        .then((res) => {
          return typia.assert<APPLICATIONS_ORDRE_PAYMENT_AMOUNT_NOT_MATCH>(res.body);
        });
    });

    it('결제 주문 승인 실패 - 결제 완료된 주문 승인 요청', async () => {
      /** pre condition */
      // dummy data
      const dummyCompetition = new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle('테스트 대회')
        .setCompetitionBasicDates(
          getCompetitionDateByStatus(
            '신청기간 중, 환불기간 중, 단독출전조정기간 전, 출전명단공개 전, 대진표공개 전 / 얼리버드할인기간 중',
          ),
        )
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .setCompetitionHostMaps([dummyAdmin.id])
        .build();
      await entityEntityManager.save(UserEntity, [dummyAdmin, dummyUser]);
      await entityEntityManager.save(CompetitionEntity, dummyCompetition);
      const participationDivisionCombination: IParticipationDivisionCombination = [
        ['어덜트', 'GI', 'MALE', '화이트', '-58'],
        ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
        ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
        ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
      ];
      const createApplicationReqBody: CreateApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, participationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      // application 생성
      const createApplicationResBody = await request(app.getHttpServer())
        .post('/user/applications')
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(createApplicationReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationRes>>(res.body);
        });
      const applicationId = createApplicationResBody.result.application.id;

      // application order 생성
      const createApplicationOrderResBody = await request(app.getHttpServer())
        .post(`/user/applications/${applicationId}/order`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationOrderRes>>(res.body);
        });
      const applicationOrders = createApplicationOrderResBody.result.application.applicationOrders;
      if (!applicationOrders) throw new Error('applicationOrders is not exist in application');

      // tosspayment-sdk 위젯에서 결제 요청 동장 시뮬레이션
      const { orderId, orderName, customerName, customerEmail } = applicationOrders[applicationOrders.length - 1];
      const amount =
        applicationOrders[applicationOrders.length - 1].applicationOrderPaymentSnapshots[applicationOrders.length - 1]
          .totalAmount;
      const keyInRet = await paymentsAppService.keyIn({
        method: 'card',
        cardNumber: '1111222233334444',
        cardExpirationYear: (new Date().getFullYear() + 1).toString().slice(-2),
        cardExpirationMonth: '04',
        orderId,
        orderName,
        customerEmail,
        amount: amount,
      });
      const payment = keyInRet.payment;

      // 결제완료
      const approveApplicationOrderReqBody: ApproveApplicationOrderReqBody = {
        orderId,
        paymentKey: payment.paymentKey,
        amount: payment.totalAmount,
      };
      const approveApplicationOrderResBody = await request(app.getHttpServer())
        .post(`/user/applications/${applicationId}/order/approve`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(approveApplicationOrderReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<ApproveApplicationOrderRes>>(res.body);
        });
      const approvedApplication = approveApplicationOrderResBody.result.application;
      expect(approvedApplication.status).toBe('DONE');
      const approvedApplicationOrder = approvedApplication.applicationOrders?.find(
        (order) => order.orderId === orderId,
      );
      if (!approvedApplicationOrder) throw new Error('approvedApplicationOrder is not exist in applicationOrders');
      expect(approvedApplicationOrder.status).toBe('DONE');
      approvedApplicationOrder.applicationOrderPaymentSnapshots[0].participationDivisionInfoPayments.forEach(
        (participationDivisionInfoPayment) => {
          expect(participationDivisionInfoPayment.status).toBe('DONE');
        },
      );
      approvedApplication.participationDivisionInfos.forEach((participationDivisionInfo) => {
        expect(participationDivisionInfo.status).toBe('DONE');
      });

      /** main test */
      const approveApplicationOrderReqBody2: ApproveApplicationOrderReqBody = {
        orderId,
        paymentKey: payment.paymentKey,
        amount: payment.totalAmount,
      };
      const approveApplicationOrderResBody2 = await request(app.getHttpServer())
        .post(`/user/applications/${applicationId}/order/approve`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(approveApplicationOrderReqBody2)
        .then((res) => {
          return typia.assert<ENTITY_NOT_FOUND>(res.body);
        });
    });

    it('todo!!! 결제 주문 승인 실패 - 결제 취소된 주문 승인 요청', async () => {});
  });

  describe('u-6-10 cancelApplicationOrder', () => {
    it('결제 주문 취소 성공 - 전체 취소', async () => {
      /** pre condition */
      // dummy data
      const dummyCompetition = new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle('테스트 대회')
        .setCompetitionBasicDates(
          getCompetitionDateByStatus(
            '신청기간 중, 환불기간 중, 단독출전조정기간 전, 출전명단공개 전, 대진표공개 전 / 얼리버드할인기간 중',
          ),
        )
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .setCompetitionHostMaps([dummyAdmin.id])
        .build();
      await entityEntityManager.save(UserEntity, [dummyAdmin, dummyUser]);
      await entityEntityManager.save(CompetitionEntity, dummyCompetition);
      const participationDivisionCombination: IParticipationDivisionCombination = [
        ['어덜트', 'GI', 'MALE', '화이트', '-58'],
        ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
        ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
        ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
      ];
      const createApplicationReqBody: CreateApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, participationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      // application 생성
      const createApplicationResBody = await request(app.getHttpServer())
        .post('/user/applications')
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(createApplicationReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationRes>>(res.body);
        });
      const applicationId = createApplicationResBody.result.application.id;

      // application order 생성
      const createApplicationOrderResBody = await request(app.getHttpServer())
        .post(`/user/applications/${applicationId}/order`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationOrderRes>>(res.body);
        });
      const applicationOrders = createApplicationOrderResBody.result.application.applicationOrders;
      if (!applicationOrders) throw new Error('applicationOrders is not exist in application');

      // tosspayment-sdk 위젯에서 결제 요청 동장 시뮬레이션
      const { orderId, orderName, customerName, customerEmail } = applicationOrders[applicationOrders.length - 1];
      const amount =
        applicationOrders[applicationOrders.length - 1].applicationOrderPaymentSnapshots[applicationOrders.length - 1]
          .totalAmount;
      const keyInRet = await paymentsAppService.keyIn({
        method: 'card',
        cardNumber: '1111222233334444',
        cardExpirationYear: (new Date().getFullYear() + 1).toString().slice(-2), //내년
        cardExpirationMonth: '04',
        orderId,
        orderName,
        customerEmail,
        amount: amount,
      });
      const payment = keyInRet.payment;

      const approveApplicationOrderReqBody: ApproveApplicationOrderReqBody = {
        orderId,
        paymentKey: payment.paymentKey,
        amount: payment.totalAmount,
      };
      const approveApplicationOrderResBody = await request(app.getHttpServer())
        .post(`/user/applications/${applicationId}/order/approve`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(approveApplicationOrderReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<ApproveApplicationOrderRes>>(res.body);
        });
      const approvedApplication = approveApplicationOrderResBody.result.application;
      expect(approvedApplication.status).toBe('DONE');
      const approvedApplicationOrder = approvedApplication.applicationOrders?.find(
        (order) => order.orderId === orderId,
      );
      if (!approvedApplicationOrder) throw new Error('approvedApplicationOrder is not exist in applicationOrders');
      expect(approvedApplicationOrder.status).toBe('DONE');
      approvedApplicationOrder.applicationOrderPaymentSnapshots[0].participationDivisionInfoPayments.forEach(
        (participationDivisionInfoPayment) => {
          expect(participationDivisionInfoPayment.status).toBe('DONE');
        },
      );
      approvedApplication.participationDivisionInfos.forEach((participationDivisionInfo) => {
        expect(participationDivisionInfo.status).toBe('DONE');
      });

      /** main test */
      const participationDivisionInfoIds = approvedApplication.participationDivisionInfos.map(
        (participationDivisionInfo) => participationDivisionInfo.id,
      );
      const cancelApplicationOrderReqBody: CancelApplicationOrderReqBody = {
        participationDivisionInfoIds: [...participationDivisionInfoIds],
      };

      const cancelApplicationOrderResBody = await request(app.getHttpServer())
        .post(`/user/applications/${applicationId}/order/cancel`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(cancelApplicationOrderReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CancelApplicationOrderRes>>(res.body);
        });
      const canceledApplication = cancelApplicationOrderResBody.result.application;

      expect(canceledApplication.status).toBe('CANCELED');
      const canceledApplicationOrder = canceledApplication.applicationOrders?.find(
        (order) => order.orderId === orderId,
      );
      if (!canceledApplicationOrder) throw new Error('canceledApplicationOrder is not exist in applicationOrders');
      expect(canceledApplicationOrder.status).toBe('CANCELED');
      expect(canceledApplicationOrder.applicationOrderPaymentSnapshots.length).toBe(1);
      expect(
        canceledApplicationOrder.applicationOrderPaymentSnapshots[0].participationDivisionInfoPayments.length,
      ).toBe(4);
      expect(
        canceledApplicationOrder.applicationOrderPaymentSnapshots[0].participationDivisionInfoPayments.forEach(
          (participationDivisionInfoPayment) => {
            expect(participationDivisionInfoPayment.status).toBe('CANCELED');
          },
        ),
      );
    });

    it('결제 주문 취소 성공 - 부분 취소', async () => {
      /** pre condition */
      // dummy data
      const dummyCompetition = new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle('테스트 대회')
        .setCompetitionBasicDates(
          getCompetitionDateByStatus(
            '신청기간 중, 환불기간 중, 단독출전조정기간 전, 출전명단공개 전, 대진표공개 전 / 얼리버드할인기간 중',
          ),
        )
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .setCompetitionHostMaps([dummyAdmin.id])
        .build();
      await entityEntityManager.save(UserEntity, [dummyAdmin, dummyUser]);
      await entityEntityManager.save(CompetitionEntity, dummyCompetition);
      const participationDivisionCombination: IParticipationDivisionCombination = [
        ['어덜트', 'GI', 'MALE', '화이트', '-58'],
        ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
        ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
        ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
      ];
      const createApplicationReqBody: CreateApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, participationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      // application 생성
      const createApplicationResBody = await request(app.getHttpServer())
        .post('/user/applications')
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(createApplicationReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationRes>>(res.body);
        });
      const applicationId = createApplicationResBody.result.application.id;

      // application order 생성
      const createApplicationOrderResBody = await request(app.getHttpServer())
        .post(`/user/applications/${applicationId}/order`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationOrderRes>>(res.body);
        });
      const applicationOrders = createApplicationOrderResBody.result.application.applicationOrders;
      if (!applicationOrders) throw new Error('applicationOrders is not exist in application');

      // tosspayment-sdk 위젯에서 결제 요청 동장 시뮬레이션
      const { orderId, orderName, customerName, customerEmail } = applicationOrders[applicationOrders.length - 1];
      const amount =
        applicationOrders[applicationOrders.length - 1].applicationOrderPaymentSnapshots[applicationOrders.length - 1]
          .totalAmount;
      const keyInRet = await paymentsAppService.keyIn({
        method: 'card',
        cardNumber: '1111222233334444',
        cardExpirationYear: (new Date().getFullYear() + 1).toString().slice(-2),
        cardExpirationMonth: '04',
        orderId,
        orderName,
        customerEmail,
        amount: amount,
      });
      const payment = keyInRet.payment;

      const approveApplicationOrderReqBody: ApproveApplicationOrderReqBody = {
        orderId,
        paymentKey: payment.paymentKey,
        amount: payment.totalAmount,
      };
      const approveApplicationOrderResBody = await request(app.getHttpServer())
        .post(`/user/applications/${applicationId}/order/approve`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(approveApplicationOrderReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<ApproveApplicationOrderRes>>(res.body);
        });
      const approvedApplication = approveApplicationOrderResBody.result.application;
      expect(approvedApplication.status).toBe('DONE');
      const approvedApplicationOrder = approvedApplication.applicationOrders?.find(
        (order) => order.orderId === orderId,
      );
      if (!approvedApplicationOrder) throw new Error('approvedApplicationOrder is not exist in applicationOrders');
      expect(approvedApplicationOrder.status).toBe('DONE');
      approvedApplicationOrder.applicationOrderPaymentSnapshots[0].participationDivisionInfoPayments.forEach(
        (participationDivisionInfoPayment) => {
          expect(participationDivisionInfoPayment.status).toBe('DONE');
        },
      );
      approvedApplication.participationDivisionInfos.forEach((participationDivisionInfo) => {
        expect(participationDivisionInfo.status).toBe('DONE');
      });

      /** main test */
      const participationDivisionInfoIds = approvedApplication.participationDivisionInfos.map(
        (participationDivisionInfo) => participationDivisionInfo.id,
      );
      const cancelApplicationOrderReqBody: CancelApplicationOrderReqBody = {
        participationDivisionInfoIds: [participationDivisionInfoIds[0]],
      };

      const cancelApplicationOrderResBody = await request(app.getHttpServer())
        .post(`/user/applications/${applicationId}/order/cancel`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(cancelApplicationOrderReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CancelApplicationOrderRes>>(res.body);
        });
      const canceledApplication = cancelApplicationOrderResBody.result.application;

      expect(canceledApplication.status).toBe('PARTIAL_CANCELED');
      const canceledApplicationOrder = canceledApplication.applicationOrders?.find(
        (order) => order.orderId === orderId,
      );
      if (!canceledApplicationOrder) throw new Error('canceledApplicationOrder is not exist in applicationOrders');
      expect(canceledApplicationOrder.status).toBe('PARTIAL_CANCELED');
      expect(canceledApplicationOrder.applicationOrderPaymentSnapshots.length).toBe(2);
      expect(
        canceledApplicationOrder.applicationOrderPaymentSnapshots[1].participationDivisionInfoPayments.length,
      ).toBe(3);
      expect(
        canceledApplicationOrder.applicationOrderPaymentSnapshots[1].participationDivisionInfoPayments.forEach(
          (participationDivisionInfoPayment) => {
            expect(participationDivisionInfoPayment.status).toBe('DONE');
          },
        ),
      );
    });

    it('결제 주문 취소 성공 - 부분 반복으로 전체 취소', async () => {
      /** pre condition */
      // dummy data
      const dummyCompetition = new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle('테스트 대회')
        .setCompetitionBasicDates(
          getCompetitionDateByStatus(
            '신청기간 중, 환불기간 중, 단독출전조정기간 전, 출전명단공개 전, 대진표공개 전 / 얼리버드할인기간 중',
          ),
        )
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .setCompetitionHostMaps([dummyAdmin.id])
        .build();
      await entityEntityManager.save(UserEntity, [dummyAdmin, dummyUser]);
      await entityEntityManager.save(CompetitionEntity, dummyCompetition);
      const participationDivisionCombination: IParticipationDivisionCombination = [
        ['어덜트', 'GI', 'MALE', '화이트', '-58'],
        ['어덜트', 'GI', 'MALE', '화이트', '-76_ABSOLUTE'],
        ['노기통합', 'NOGI', 'MALE', '초급', '-50'],
        ['노기통합', 'NOGI', 'MALE', '초급', 'ABSOLUTE'],
      ];
      const createApplicationReqBody: CreateApplicationReqBody = {
        competitionId: dummyCompetition.id,
        applicationType: 'SELF',
        participationDivisionIds: extractDivisionIds(dummyCompetition, participationDivisionCombination),
        playerSnapshotCreateDto: {
          name: dummyUser.name,
          gender: dummyUser.gender,
          birth: dummyUser.birth,
          phoneNumber: dummyUser.phoneNumber,
          belt: '화이트',
          network: '테스트 네트워크',
          team: '테스트 팀',
          masterName: '테스트 마스터',
        },
        additionalInfoCreateDtos: [
          {
            type: 'SOCIAL_SECURITY_NUMBER',
            value: '123456-1234567',
          },
          {
            type: 'ADDRESS',
            value: '테스트 주소',
          },
        ],
      };
      // application 생성
      const createApplicationResBody = await request(app.getHttpServer())
        .post('/user/applications')
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(createApplicationReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationRes>>(res.body);
        });
      const applicationId = createApplicationResBody.result.application.id;

      // application order 생성
      const createApplicationOrderResBody = await request(app.getHttpServer())
        .post(`/user/applications/${applicationId}/order`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<CreateApplicationOrderRes>>(res.body);
        });
      const applicationOrders = createApplicationOrderResBody.result.application.applicationOrders;
      if (!applicationOrders) throw new Error('applicationOrders is not exist in application');

      // tosspayment-sdk 위젯에서 결제 요청 동장 시뮬레이션
      const { orderId, orderName, customerName, customerEmail } = applicationOrders[applicationOrders.length - 1];
      const amount =
        applicationOrders[applicationOrders.length - 1].applicationOrderPaymentSnapshots[applicationOrders.length - 1]
          .totalAmount;
      const keyInRet = await paymentsAppService.keyIn({
        method: 'card',
        cardNumber: '1111222233334444',
        cardExpirationYear: (new Date().getFullYear() + 1).toString().slice(-2),
        cardExpirationMonth: '04',
        orderId,
        orderName,
        customerEmail,
        amount: amount,
      });
      const payment = keyInRet.payment;

      const approveApplicationOrderReqBody: ApproveApplicationOrderReqBody = {
        orderId,
        paymentKey: payment.paymentKey,
        amount: payment.totalAmount,
      };
      const approveApplicationOrderResBody = await request(app.getHttpServer())
        .post(`/user/applications/${applicationId}/order/approve`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(approveApplicationOrderReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<ApproveApplicationOrderRes>>(res.body);
        });
      const approvedApplication = approveApplicationOrderResBody.result.application;
      expect(approvedApplication.status).toBe('DONE');
      const approvedApplicationOrder = approvedApplication.applicationOrders?.find(
        (order) => order.orderId === orderId,
      );
      if (!approvedApplicationOrder) throw new Error('approvedApplicationOrder is not exist in applicationOrders');
      expect(approvedApplicationOrder.status).toBe('DONE');
      approvedApplicationOrder.applicationOrderPaymentSnapshots[0].participationDivisionInfoPayments.forEach(
        (participationDivisionInfoPayment) => {
          expect(participationDivisionInfoPayment.status).toBe('DONE');
        },
      );
      approvedApplication.participationDivisionInfos.forEach((participationDivisionInfo) => {
        expect(participationDivisionInfo.status).toBe('DONE');
      });

      /** main test */
      const participationDivisionInfoIds = approvedApplication.participationDivisionInfos.map(
        (participationDivisionInfo) => participationDivisionInfo.id,
      );
      const cancelApplicationOrderReqBody: CancelApplicationOrderReqBody = {
        participationDivisionInfoIds: [participationDivisionInfoIds[0]],
      };

      const cancelApplicationOrderResBody = await request(app.getHttpServer())
        .post(`/user/applications/${applicationId}/order/cancel`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(cancelApplicationOrderReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CancelApplicationOrderRes>>(res.body);
        });
      const canceledApplication = cancelApplicationOrderResBody.result.application;
      const cancelApplicationOrderReqBody2: CancelApplicationOrderReqBody = {
        participationDivisionInfoIds: [
          participationDivisionInfoIds[1],
          participationDivisionInfoIds[2],
          participationDivisionInfoIds[3],
        ],
      };
      expect(canceledApplication.status).toBe('PARTIAL_CANCELED');

      const cancelApplicationOrderResBody2 = await request(app.getHttpServer())
        .post(`/user/applications/${applicationId}/order/cancel`)
        .set('Authorization', `Bearer ${dummyUserAccessToken}`)
        .send(cancelApplicationOrderReqBody2)
        .then((res) => {
          return typia.assert<ResponseForm<CancelApplicationOrderRes>>(res.body);
        });
      const canceledApplication2 = cancelApplicationOrderResBody2.result.application;

      expect(canceledApplication2.status).toBe('CANCELED');
      const canceledApplicationOrder = canceledApplication2.applicationOrders?.find(
        (order) => order.orderId === orderId,
      );
      if (!canceledApplicationOrder) throw new Error('canceledApplicationOrder is not exist in applicationOrders');
      expect(canceledApplicationOrder.status).toBe('CANCELED');
      expect(canceledApplicationOrder.applicationOrderPaymentSnapshots.length).toBe(2);
      expect(
        canceledApplicationOrder.applicationOrderPaymentSnapshots[1].participationDivisionInfoPayments.length,
      ).toBe(3);
      expect(
        canceledApplicationOrder.applicationOrderPaymentSnapshots[1].participationDivisionInfoPayments.forEach(
          (participationDivisionInfoPayment) => {
            expect(participationDivisionInfoPayment.status).toBe('CANCELED');
          },
        ),
      );
    });

    it('todo!!!: 결제 주문 취소 성공 - 단독 출전 조정 기간중, 단독출전 부문 취소', async () => {});

    it('todo!!!: 결제 주문 취소 실패 - 환불 가능기간 종료', async () => {});

    it('todo!!!: 결제 주문 취소 실패 - 단독 출전 조정 기간중, 단독출전 부문이 아닌 부문 취소 시도', async () => {});
  });
});
