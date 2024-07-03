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
  APPLICATIONS_REGISTRATION_ENDED,
  APPLICATIONS_REGISTRATION_NOT_STARTED,
  APPLICATIONS_REQUIRED_ADDITIONAL_INFO_NOT_MATCH,
} from '../../../src/common/response/errorResponse';

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

    it('신청 실패 - 단독 출전 조정 기간중 출전 인원 0명 부문에 신청', async () => {});

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
      const now = new Date();
      dummyCompetition.registrationEndDate = new Date(now.setDate(now.getDate() - 1));
      await entityEntityManager.save(CompetitionEntity, dummyCompetition);

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

    it('READY(결제전) 신청 수정 실패 - 단독 출전 조정 기간중 출전 인원 0명 부문으로 수정', async () => {});

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
    it('DONE(결제완료) 신청 수정 성공', async () => {});

    it('DONE(결제완료) 신청 수정 실패 - 대회 신청 기간 종료', async () => {});

    it('DONE(결제완료) 신청 수정 실패 - 단독 출전 조정 기간중 출전 인원 0명 부문으로 수정', async () => {});

    it('DONE(결제완료) 신청 수정 실패 - 선수 정보와 맞지 않는 부문 성별', async () => {});

    it('DONE(결제완료) 신청 수정 실패 - 선수 정보와 맞지 않는 부문 나이', async () => {});
  });

  describe('u-6-5 deleteApplication', () => {
    it('신청 삭제 성공', async () => {});
  });

  describe('u-6-6 getExpectedPayment @Deprecated', () => {});

  describe('u-6-7 findApplications', () => {
    it('신청 목록 조회 성공', async () => {});
  });

  describe('u-6-8 createApplicationOrder', () => {
    it('결제 주문 생성 성공', async () => {});

    it('결제 주문 생성 실패 - 대회 신청 기간 종료', async () => {});
  });
});
