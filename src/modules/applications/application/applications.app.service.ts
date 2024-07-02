import { Injectable } from '@nestjs/common';
import { ApplicationFactory } from '../domain/application.factory';
import {
  CreateApplicationOrderParam,
  CreateApplicationOrderRet,
  CreateApplicationParam,
  CreateApplicationRet,
  FindApplicationsParam,
  FindApplicationsRet,
  GetApplicationParam,
  GetApplicationRet,
  GetExpectedPaymentParam,
  GetExpectedPaymentRet,
  UpdateDoneApplicationParam,
  UpdateDoneApplicationRet,
  UpdateReadyApplicationParam,
  UpdateReadyApplicationRet,
} from './applications.app.dto';
import { CompetitionModel } from '../../competitions/domain/model/competition.model';
import { assert } from 'typia';
import { ApplicationsErrors, BusinessException, CommonErrors } from '../../../common/response/errorResponse';
import { UserModel } from '../../users/domain/model/user.model';
import { UserRepository } from '../../../database/custom-repository/user.repository';
import { ApplicationRepository } from '../../../database/custom-repository/application.repository';
import { CompetitionRepository } from '../../../database/custom-repository/competition.repository';
import { PlayerSnapshotModel } from '../domain/model/player-snapshot.model';
import { ParticipationDivisionInfoSnapshotModel } from '../domain/model/participation-division-info-snapshot.model';
import { ApplicationModel } from '../domain/model/application.model';
import { In } from 'typeorm';
import { ApplicationOrderModel } from '../domain/model/application-order.model';

@Injectable()
export class ApplicationsAppService {
  constructor(
    private readonly applicationFactory: ApplicationFactory,
    private readonly userRepository: UserRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly competitionRepository: CompetitionRepository,
  ) {}

  /** Create application. */
  async createApplication({ applicationCreateDto }: CreateApplicationParam): Promise<CreateApplicationRet> {
    const [userEntity, competitionEntity] = await Promise.all([
      this.userRepository
        .findOneOrFail({
          where: { id: applicationCreateDto.userId },
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      this.competitionRepository
        .findOneOrFail({
          where: { id: applicationCreateDto.competitionId, status: 'ACTIVE' },
          relations: [
            'divisions',
            'earlybirdDiscountSnapshots',
            'combinationDiscountSnapshots',
            'requiredAdditionalInfos',
            'competitionHostMaps',
          ],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
        }),
    ]);
    const userModel = new UserModel(userEntity);
    const competitionModel = new CompetitionModel(competitionEntity);

    const readyApplication = new ApplicationModel(
      this.applicationFactory.createReadyApplication(competitionModel, applicationCreateDto),
    );
    competitionModel.validateApplicationPeriod();
    competitionModel.validateAdditionalInfo(applicationCreateDto.additionalInfoCreateDtos);
    readyApplication.validateApplicationType(userModel);
    readyApplication.validateDivisionSuitability();
    readyApplication.setExpectedPayment(
      competitionModel.calculateExpectedPayment(readyApplication.getParticipationDivisionIds()),
    );
    return assert<CreateApplicationRet>({
      application: await this.applicationRepository.save(readyApplication.toData()),
    });
  }

  /** Get application. */
  async getApplication({ userId, applicationId }: GetApplicationParam): Promise<GetApplicationRet> {
    const applicationEntity = await this.applicationRepository
      .findOneOrFail({
        where: { id: applicationId, userId },
        relations: [
          'additionalInfos',
          'playerSnapshots',
          'participationDivisionInfos',
          'participationDivisionInfos.participationDivisionInfoSnapshots',
          'participationDivisionInfos.participationDivisionInfoSnapshots.division',
          'participationDivisionInfos.participationDivisionInfoSnapshots.division.priceSnapshots',
          'applicationOrders',
          'applicationOrders.applicationOrderPaymentSnapshots',
          'applicationOrders.applicationOrderPaymentSnapshots.participationDivisionInfoPayments',
        ],
      })
      .catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Application not found');
      });
    const competitionEntity = await this.competitionRepository
      .findOneOrFail({
        where: { id: applicationEntity.competitionId },
        relations: [
          'divisions',
          'earlybirdDiscountSnapshots',
          'combinationDiscountSnapshots',
          'requiredAdditionalInfos',
          'competitionHostMaps',
        ],
      })
      .catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
      });
    const applicationModel = new ApplicationModel(applicationEntity);
    const competitionModel = new CompetitionModel(competitionEntity);
    if (applicationModel.getStatus() === 'READY') {
      applicationModel.setExpectedPayment(
        competitionModel.calculateExpectedPayment(applicationModel.getParticipationDivisionIds()),
      );
    }
    return assert<GetApplicationRet>({ application: applicationModel.toData() });
  }

  /**
   * Update ready application.
   * - READY status 를 가진 application 을 업데이트 합니다.
   * - CANCELED, DONE 상태의 application 은 이 api 를 통해 업데이트 할 수 없습니다.
   * - 기존 application 을 DELETEED 상태로 변경하고 새로운 application 을 생성합니다.
   * - 새로운 application을 생성하는 이유, 기존 applicaiton이 실제로는 결제 됐지만 실패처리 된 후, 업데이트시 기존 결제 정보가 남아있어야하기 때문.
   */
  async updateReadyApplication({
    applicationId,
    applicationCreateDto,
  }: UpdateReadyApplicationParam): Promise<UpdateReadyApplicationRet> {
    const [userEntity, oldApplicationEntity] = await Promise.all([
      this.userRepository
        .findOneOrFail({
          where: { id: applicationCreateDto.userId },
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      this.applicationRepository
        .findOneOrFail({
          where: {
            id: applicationId,
            userId: applicationCreateDto.userId,
            status: 'READY',
          },
          relations: [
            'additionalInfos',
            'playerSnapshots',
            'participationDivisionInfos',
            'participationDivisionInfos.participationDivisionInfoSnapshots',
            'participationDivisionInfos.participationDivisionInfoSnapshots.division',
            'participationDivisionInfos.participationDivisionInfoSnapshots.division.priceSnapshots',
          ],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Application not found');
        }),
    ]);
    const competitionEntity = await this.competitionRepository
      .findOneOrFail({
        where: { id: oldApplicationEntity.competitionId },
        relations: [
          'divisions',
          'earlybirdDiscountSnapshots',
          'combinationDiscountSnapshots',
          'requiredAdditionalInfos',
          'competitionHostMaps',
        ],
      })
      .catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
      });
    const userModel = new UserModel(userEntity);
    const oldApplicationModel = new ApplicationModel(oldApplicationEntity);
    const competitionModel = new CompetitionModel(competitionEntity);
    const newApplication = new ApplicationModel(
      this.applicationFactory.createReadyApplication(competitionModel, {
        ...applicationCreateDto,
      }),
    );
    competitionModel.validateApplicationPeriod();
    competitionModel.validateAdditionalInfo(applicationCreateDto.additionalInfoCreateDtos);
    newApplication.validateApplicationType(userModel);
    newApplication.validateDivisionSuitability();
    oldApplicationModel.delete();
    // todo!!: Transaction
    await this.applicationRepository.save(oldApplicationModel.toData());
    newApplication.setExpectedPayment(
      competitionModel.calculateExpectedPayment(newApplication.getParticipationDivisionIds()),
    );
    return assert<UpdateReadyApplicationRet>({
      application: await this.applicationRepository.save(newApplication.toData()),
    });
  }

  /** Update done application. */
  async updateDoneApplication({
    userId,
    applicationId,
    doneApplicationUpdateDto,
  }: UpdateDoneApplicationParam): Promise<UpdateDoneApplicationRet> {
    if (
      !doneApplicationUpdateDto.participationDivisionInfoUpdateDtos &&
      !doneApplicationUpdateDto.playerSnapshotCreateDto &&
      !doneApplicationUpdateDto.additionalInfoUpdateDtos
    ) {
      throw new BusinessException(ApplicationsErrors.APPLICATIONS_PLAYER_SNAPSHOT_OR_DIVISION_INFO_REQUIRED);
    }
    const [userEntity, applicationEntity] = await Promise.all([
      this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
      }),
      this.applicationRepository
        .findOneOrFail({
          where: { userId, id: applicationId, status: 'DONE' },
          relations: [
            'additionalInfos',
            'playerSnapshots',
            'participationDivisionInfos',
            'participationDivisionInfos.participationDivisionInfoSnapshots',
            'participationDivisionInfos.participationDivisionInfoSnapshots.division',
            'participationDivisionInfos.participationDivisionInfoSnapshots.division.priceSnapshots',
            'applicationOrders',
            'applicationOrders.applicationOrderPaymentSnapshots',
            'applicationOrders.applicationOrderPaymentSnapshots.participationDivisionInfoPayments',
          ],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Application not found');
        }),
    ]);
    const competitionEntity = await this.competitionRepository
      .findOneOrFail({
        where: { id: applicationEntity.competitionId },
        relations: [
          'divisions',
          'earlybirdDiscountSnapshots',
          'combinationDiscountSnapshots',
          'requiredAdditionalInfos',
          'competitionHostMaps',
        ],
      })
      .catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
      });
    const userModel = new UserModel(userEntity);
    const applicationModel = new ApplicationModel(applicationEntity);
    const competitionModel = new CompetitionModel(competitionEntity);

    if (doneApplicationUpdateDto.playerSnapshotCreateDto) {
      applicationModel.addPlayerSnapshot(
        new PlayerSnapshotModel(
          this.applicationFactory.createPlayerSnapshot(applicationId, doneApplicationUpdateDto.playerSnapshotCreateDto),
        ),
      );
    }
    if (doneApplicationUpdateDto.participationDivisionInfoUpdateDtos) {
      applicationModel.addParticipationDivisionInfoSnapshots(
        this.applicationFactory
          .createManyParticipationDivisionInfoSnapshots(
            competitionModel,
            doneApplicationUpdateDto.participationDivisionInfoUpdateDtos,
          )
          .map((snapshot) => new ParticipationDivisionInfoSnapshotModel(snapshot)),
      );
    }
    if (doneApplicationUpdateDto.additionalInfoUpdateDtos) {
      competitionModel.validateAdditionalInfo(doneApplicationUpdateDto.additionalInfoUpdateDtos);
      applicationModel.updateAdditionalInfos(doneApplicationUpdateDto.additionalInfoUpdateDtos);
    }
    competitionModel.validateApplicationPeriod();
    applicationModel.validateApplicationType(userModel);
    applicationModel.validateDivisionSuitability();
    return assert<UpdateDoneApplicationRet>({
      application: await this.applicationRepository.save(applicationModel.toData()),
    });
  }

  /**
   * Get expected payment.
   * - 현재 가격, 할인 정보를 바탕으로 application 의 예상 결제 금액을 계산합니다.
   * @deprecated
   */
  async getExpectedPayment({ userId, applicationId }: GetExpectedPaymentParam): Promise<GetExpectedPaymentRet> {
    const applicationEntity = await this.applicationRepository
      .findOneOrFail({
        where: { userId, id: applicationId },
        relations: [
          'additionalInfos',
          'playerSnapshots',
          'participationDivisionInfos',
          'participationDivisionInfos.participationDivisionInfoSnapshots',
          'participationDivisionInfos.participationDivisionInfoSnapshots.division',
          'participationDivisionInfos.participationDivisionInfoSnapshots.division.priceSnapshots',
        ],
      })
      .catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Application not found');
      });
    const competitionEntity = await this.competitionRepository
      .findOneOrFail({
        where: { id: applicationEntity.competitionId },
        relations: [
          'divisions',
          'earlybirdDiscountSnapshots',
          'combinationDiscountSnapshots',
          'requiredAdditionalInfos',
          'competitionHostMaps',
        ],
      })
      .catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
      });
    const applicationModel = new ApplicationModel(applicationEntity);
    const competitionModel = new CompetitionModel(competitionEntity);
    return assert<GetExpectedPaymentRet>({
      expectedPayment: competitionModel.calculateExpectedPayment(applicationModel.getParticipationDivisionIds()),
    });
  }

  async findApplications({ userId, status, page, limit }: FindApplicationsParam): Promise<FindApplicationsRet> {
    const applicationEntities = await this.applicationRepository.find({
      where: { userId, status },
      relations: [
        'additionalInfos',
        'playerSnapshots',
        'participationDivisionInfos',
        'participationDivisionInfos.participationDivisionInfoSnapshots',
        'participationDivisionInfos.participationDivisionInfoSnapshots.division',
        'participationDivisionInfos.participationDivisionInfoSnapshots.division.priceSnapshots',
        'applicationOrders',
        'applicationOrders.applicationOrderPaymentSnapshots',
        'applicationOrders.applicationOrderPaymentSnapshots.participationDivisionInfoPayments',
      ],
      order: { createdAt: 'DESC' },
      skip: page * limit,
      take: limit,
    });
    const applicationModels = applicationEntities.map((applicationEntity) => new ApplicationModel(applicationEntity));
    const competitions = (
      await this.competitionRepository.find({
        where: { id: In(applicationModels.map((application) => application.getCompetitionId())) },
        relations: [
          'divisions',
          'divisions.priceSnapshots',
          'earlybirdDiscountSnapshots',
          'combinationDiscountSnapshots',
        ],
      })
    ).map((competitionEntity) => new CompetitionModel(competitionEntity));
    applicationModels.forEach((application) => {
      const competition = competitions.find((competition) => competition.getId() === application.getCompetitionId());
      if (!competition) throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
      if (application.getStatus() === 'READY')
        application.setExpectedPayment(competition.calculateExpectedPayment(application.getParticipationDivisionIds()));
    });
    const ret = assert<FindApplicationsRet>({
      applications: applicationModels.map((application) => application.toData()),
    });
    if (applicationModels.length === limit) ret.nextPage = page + 1;
    return ret;
  }

  async createApplicationOrder({ userId, applicationId }: CreateApplicationOrderParam) {
    const [userEntity, applicationEntity] = await Promise.all([
      this.userRepository.findOne({ where: { id: userId } }).then((user) => {
        if (!user) throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        return user;
      }),
      this.applicationRepository
        .findOne({
          where: { id: applicationId, userId, status: 'READY' },
          relations: [
            'additionalInfos',
            'playerSnapshots',
            'participationDivisionInfos',
            'participationDivisionInfos.participationDivisionInfoSnapshots',
            'participationDivisionInfos.participationDivisionInfoSnapshots.division',
            'participationDivisionInfos.participationDivisionInfoSnapshots.division.priceSnapshots',
            'applicationOrders',
            'applicationOrders.applicationOrderPaymentSnapshots',
            'applicationOrders.applicationOrderPaymentSnapshots.participationDivisionInfoPayments',
            'applicationOrders.applicationOrderPaymentSnapshots.participationDivisionInfoPayments.participationDivisionInfo',
            'applicationOrders.applicationOrderPaymentSnapshots.participationDivisionInfoPayments.participationDivisionInfo.participationDivisionInfoSnapshots.division.priceSnapshots',
            'applicationOrders.applicationOrderPaymentSnapshots.participationDivisionInfoPayments.division',
            'applicationOrders.applicationOrderPaymentSnapshots.participationDivisionInfoPayments.priceSnapshot',
          ],
        })
        .then((application) => {
          if (!application) throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Application not found');
          return application;
        }),
    ]);
    const competitionEntity = await this.competitionRepository
      .findOne({
        where: { id: applicationEntity.competitionId },
        relations: [
          'divisions',
          'earlybirdDiscountSnapshots',
          'combinationDiscountSnapshots',
          'requiredAdditionalInfos',
          'competitionHostMaps',
        ],
      })
      .then((competition) => {
        if (!competition) throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
        return competition;
      });
    // console.log('userEntity', userEntity);
    console.log('applicationEntity', applicationEntity);
    const userModel = new UserModel(userEntity);
    const applicationModel = new ApplicationModel(applicationEntity);
    const competitionModel = new CompetitionModel(competitionEntity);
    applicationModel.setExpectedPayment(
      competitionModel.calculateExpectedPayment(applicationModel.getParticipationDivisionIds()),
    );
    const applicationOrder = new ApplicationOrderModel(
      this.applicationFactory.createApplicationOrder(applicationModel, userModel, competitionModel),
    );
    console.log(JSON.stringify(applicationOrder.toData(), null, 2));
    applicationModel.addApplicationOrder(applicationOrder);
    return assert<CreateApplicationOrderRet>({
      application: await this.applicationRepository.save(applicationModel.toData()),
    });
  }
}
