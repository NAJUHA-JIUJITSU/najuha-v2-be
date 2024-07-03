import { Injectable } from '@nestjs/common';
import { UserModel } from '../../users/domain/model/user.model';
import { CompetitionModel } from '../../competitions/domain/model/competition.model';
import { ApplicationModel } from './model/application.model';
import { ApplicationRepository } from '../../../database/custom-repository/application.repository';

@Injectable()
export class ApplicationValidationService {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  async validateCreateApplication(user: UserModel, competition: CompetitionModel, application: ApplicationModel) {
    competition.validateApplicationPeriod();
    competition.validateAdditionalInfo(application.getAdditionalInfos());
    application.validateApplicationType(user);
    application.validateDivisionSuitability();

    if (competition.isSoloRegistrationAdjustmentPeriod()) {
      await this.validateSoloRegistrationAdjustment(application);
    }
  }

  private async validateSoloRegistrationAdjustment(application: ApplicationModel) {
    const participationDivisionIds = application.getParticipationDivisionIds();
    const existApplications = await this.applicationRepository.findByParticipationDivisionIds(
      participationDivisionIds,
      'DONE',
    );
  }
}
