import { Injectable } from '@nestjs/common';
import { UserModel } from '../../users/domain/model/user.model';
import { CompetitionModel } from '../../competitions/domain/model/competition.model';
import { ApplicationModel } from './model/application.model';
import { ApplicationRepository } from '../../../database/custom-repository/application.repository';

@Injectable()
export class ApplicationValidationDomainService {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  async validateCreateApplication(user: UserModel, competition: CompetitionModel, application: ApplicationModel) {
    competition.validateActiveStatus();
    competition.validateApplicationRegisterablePeriod();
    competition.validateAdditionalInfo(application.additionaInfos);

    application.validateApplicationType(user);
    application.validateDivisionSuitability();

    if (competition.isSoloRegistrationAdjustmentPeriod()) {
      await this.validateSoloRegistrationAdjustment(application);
    }
  }

  async validateUpdateReadyApplication(
    user: UserModel,
    competition: CompetitionModel,
    oldApplication: ApplicationModel,
    newApplication: ApplicationModel,
  ) {
    oldApplication.validateBeforePaymentStatus();

    competition.validateActiveStatus();
    competition.validateApplicationRegisterablePeriod();
    competition.validateAdditionalInfo(newApplication.additionaInfos);

    newApplication.validateApplicationType(user);
    newApplication.validateDivisionSuitability();

    if (competition.isSoloRegistrationAdjustmentPeriod()) {
      await this.validateSoloRegistrationAdjustment(newApplication);
    }
  }

  async validateUpdateDoneApplication(user: UserModel, competition: CompetitionModel, application: ApplicationModel) {
    application.validateAfterPaymentStatus();

    competition.validateActiveStatus();
    competition.validateApplicationRegisterablePeriod();
    competition.validateAdditionalInfo(application.additionaInfos);

    application.validateApplicationType(user);
    application.validateDivisionSuitability();

    if (competition.isSoloRegistrationAdjustmentPeriod()) {
      await this.validateSoloRegistrationAdjustment(application);
    }
  }

  async validateCreateApplicationOrder(competition: CompetitionModel, application: ApplicationModel) {
    application.validateBeforePaymentStatus();

    competition.validateActiveStatus();
    competition.validateApplicationRegisterablePeriod();

    if (competition.isSoloRegistrationAdjustmentPeriod()) {
      await this.validateSoloRegistrationAdjustment(application);
    }
  }

  async validateApproveApplicationOrder(competition: CompetitionModel, application: ApplicationModel) {
    application.validateBeforePaymentStatus();

    competition.validateActiveStatus();
    competition.validateApplicationRegisterablePeriod();

    if (competition.isSoloRegistrationAdjustmentPeriod()) {
      await this.validateSoloRegistrationAdjustment(application);
    }
  }

  async validateCancelApplicationOrder(competition: CompetitionModel, application: ApplicationModel) {
    application.validateAfterPaymentStatus();

    competition.validateActiveStatus();

    // todo!!!: 단독출전 조정기간중, 단독출전 부문의 신청은 취소 가능
    competition.validateApplicationCancelablePeriod();

    if (competition.isSoloRegistrationAdjustmentPeriod()) {
      await this.validateSoloRegistrationAdjustment(application);
    }
  }

  private async validateSoloRegistrationAdjustment(application: ApplicationModel) {
    const participationDivisionIds = application.getLatestParticipationDivisionIds();
    const existApplications = await this.applicationRepository.findByParticipationDivisionIds(
      participationDivisionIds,
      'DONE',
    );
  }
}
