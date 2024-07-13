import { Injectable } from '@nestjs/common';
import { UserModel } from '../../users/domain/model/user.model';
import { CompetitionModel } from '../../competitions/domain/model/competition.model';
import { ApplicationModel } from './model/application.model';
import { ApplicationRepository } from '../../../database/custom-repository/application.repository';
import { TId } from '../../../common/common-types';
import { DivisionModel } from '../../competitions/domain/model/division.model';
import { ApplicationsErrors, BusinessException } from '../../../common/response/errorResponse';

@Injectable()
export class ApplicationValidationDomainService {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  async validateCreateApplication(user: UserModel, competition: CompetitionModel, application: ApplicationModel) {
    if (competition.isApplicationRegisterablePeriod()) {
      application.validateBeforePaymentStatus();
      competition.validateActiveStatus();
      competition.validateAdditionalInfo(application.additionaInfos);
      application.validateApplicationType(user);
      application.validateDivisionSuitability();
    } else if (competition.isSoloRegistrationAdjustmentPeriod()) {
      application.validateBeforePaymentStatus();
      competition.validateActiveStatus();
      competition.validateAdditionalInfo(application.additionaInfos);
      application.validateApplicationType(user);
      application.validateDivisionSuitability();
      await this.validateRegisterApplicationInSoloPeriod(application);
    } else {
      throw new BusinessException(ApplicationsErrors.APPLICATIONS_REGISTERABLE_PERIOD);
    }
  }

  async validateUpdateReadyApplication(
    user: UserModel,
    competition: CompetitionModel,
    oldApplication: ApplicationModel,
    newApplication: ApplicationModel,
  ) {
    if (competition.isApplicationRegisterablePeriod()) {
      oldApplication.validateBeforePaymentStatus();
      competition.validateActiveStatus();
      competition.validateAdditionalInfo(newApplication.additionaInfos);
      newApplication.validateApplicationType(user);
      newApplication.validateDivisionSuitability();
    } else if (competition.isSoloRegistrationAdjustmentPeriod()) {
      oldApplication.validateBeforePaymentStatus();
      competition.validateActiveStatus();
      competition.validateAdditionalInfo(newApplication.additionaInfos);
      newApplication.validateApplicationType(user);
      newApplication.validateDivisionSuitability();
      await this.validateRegisterApplicationInSoloPeriod(newApplication);
    } else {
      throw new BusinessException(ApplicationsErrors.APPLICATIONS_REGISTERABLE_PERIOD);
    }
  }

  async validateUpdateDoneApplication(user: UserModel, competition: CompetitionModel, application: ApplicationModel) {
    if (competition.isApplicationRegisterablePeriod()) {
      application.validateAfterPaymentStatus();
      competition.validateActiveStatus();
      competition.validateAdditionalInfo(application.additionaInfos);
      application.validateApplicationType(user);
      application.validateDivisionSuitability();
    } else if (competition.isSoloRegistrationAdjustmentPeriod()) {
      application.validateAfterPaymentStatus();
      competition.validateActiveStatus();
      competition.validateAdditionalInfo(application.additionaInfos);
      application.validateApplicationType(user);
      application.validateDivisionSuitability();
      await this.validateRegisterApplicationInSoloPeriod(application);
    } else {
      throw new BusinessException(ApplicationsErrors.APPLICATIONS_REGISTERABLE_PERIOD);
    }
  }

  async validateCreateApplicationOrder(user: UserModel, competition: CompetitionModel, application: ApplicationModel) {
    if (competition.isApplicationRegisterablePeriod()) {
      application.validateBeforePaymentStatus();
      competition.validateActiveStatus();
      competition.validateAdditionalInfo(application.additionaInfos);
      application.validateApplicationType(user);
      application.validateDivisionSuitability();
    } else if (competition.isSoloRegistrationAdjustmentPeriod()) {
      application.validateBeforePaymentStatus();
      competition.validateActiveStatus();
      competition.validateAdditionalInfo(application.additionaInfos);
      application.validateApplicationType(user);
      application.validateDivisionSuitability();
      await this.validateRegisterApplicationInSoloPeriod(application);
    } else {
      throw new BusinessException(ApplicationsErrors.APPLICATIONS_REGISTERABLE_PERIOD);
    }
  }

  async validateApproveApplicationOrder(user: UserModel, competition: CompetitionModel, application: ApplicationModel) {
    if (competition.isApplicationRegisterablePeriod()) {
      application.validateBeforePaymentStatus();
      competition.validateActiveStatus();
      competition.validateAdditionalInfo(application.additionaInfos);
      application.validateApplicationType(user);
      application.validateDivisionSuitability();
    } else if (competition.isSoloRegistrationAdjustmentPeriod()) {
      application.validateBeforePaymentStatus();
      competition.validateActiveStatus();
      competition.validateAdditionalInfo(application.additionaInfos);
      application.validateApplicationType(user);
      application.validateDivisionSuitability();
      await this.validateRegisterApplicationInSoloPeriod(application);
    } else {
      throw new BusinessException(ApplicationsErrors.APPLICATIONS_REGISTERABLE_PERIOD);
    }
  }

  async validateCancelApplicationOrder(competition: CompetitionModel, application: ApplicationModel) {
    if (competition.isApplicationCancelablePeriod()) {
      application.validateAfterPaymentStatus();
      competition.validateActiveStatus();
    } else if (competition.isSoloRegistrationAdjustmentPeriod()) {
      application.validateAfterPaymentStatus();
      competition.validateActiveStatus();
      await this.validateCancelApplicationInSoloPeriod(application);
    } else {
      throw new BusinessException(ApplicationsErrors.APPLICATIONS_CANCELABLE_PERIOD);
    }
  }

  private async validateRegisterApplicationInSoloPeriod(application: ApplicationModel) {
    const existingParticpationDivistions = await this.getParticipationDivisions(application);

    const zeroCountDivistions: DivisionModel[] = [];

    application.participationDivisionInfos.forEach((participationDivisionInfo) => {
      const divistionId = participationDivisionInfo.getLatestParticipationDivisionInfoSnapshot().division.id;
      if (!existingParticpationDivistions[divistionId])
        zeroCountDivistions.push(participationDivisionInfo.getLatestParticipationDivisionInfoSnapshot().division);
    });

    if (zeroCountDivistions.length > 0) {
      throw new BusinessException(
        ApplicationsErrors.APPLICATIONS_REGISTER_ZERO_COUNT_DIVISIONS_IN_SOLO_PERIOD,
        `신청하신 부문 중 ${zeroCountDivistions
          .map((division) => division.name)
          .join(', ')}은 다른 신청자가 없는 부문입니다. 다른 부문을 선택해주세요.`,
      );
    }
  }

  private async validateCancelApplicationInSoloPeriod(application: ApplicationModel) {
    const existingParticpationDivistions = await this.getParticipationDivisions(application);
    if (!existingParticpationDivistions) return;

    const nonZeroCountDivistions: DivisionModel[] = [];

    application.participationDivisionInfos.forEach((participationDivisionInfo) => {
      const divistionId = participationDivisionInfo.getLatestParticipationDivisionInfoSnapshot().division.id;
      if (existingParticpationDivistions[divistionId] && existingParticpationDivistions[divistionId].count > 0)
        nonZeroCountDivistions.push(participationDivisionInfo.getLatestParticipationDivisionInfoSnapshot().division);
    });

    if (nonZeroCountDivistions.length > 0) {
      throw new BusinessException(
        ApplicationsErrors.APPLICATIONS_CANCEL_NON_ZERO_COUNT_DIVISIONS_IN_SOLO_PERIOD,
        `취소하신 부문 중 ${nonZeroCountDivistions
          .map((division) => division.name)
          .join(', ')}은 다른 신청자가 있는 부문입니다. 다른 부문을 선택해주세요.`,
      );
    }
  }

  private async getParticipationDivisions(application: ApplicationModel) {
    const existingApplicationEntities = await this.applicationRepository.find({
      where: {
        competitionId: application.competitionId,
        status: 'DONE',
      },
      relations: [
        'additionaInfos',
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
        'applicationOrders.earlybirdDiscountSnapshot',
        'applicationOrders.combinationDiscountSnapshot',
      ],
    });

    const existingApplications = existingApplicationEntities.map(
      (existingApplication) => new ApplicationModel(existingApplication),
    );

    const participationDivistionMap: IParticipationDivisionMap = {};
    existingApplications
      .filter((existingApplication) => existingApplication.id !== application.id)
      .forEach((existingApplication) => {
        existingApplication.participationDivisionInfos
          .filter((existingParticipationDivisionInfo) => existingParticipationDivisionInfo.status === 'DONE')
          .forEach((existingParticipationDivisionInfo) => {
            const divistionId =
              existingParticipationDivisionInfo.getLatestParticipationDivisionInfoSnapshot().division.id;
            if (!participationDivistionMap[divistionId]) {
              participationDivistionMap[divistionId] = {
                count: 0,
                divistion: existingParticipationDivisionInfo.getLatestParticipationDivisionInfoSnapshot().division,
              };
            } else {
              participationDivistionMap[divistionId].count += 1;
            }
          });
      });

    return participationDivistionMap;
  }
}

interface IParticipationDivisionMap {
  [key: TId]: {
    count: number;
    divistion: DivisionModel;
  };
}
