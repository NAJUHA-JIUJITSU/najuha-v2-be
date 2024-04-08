import { Injectable } from '@nestjs/common';
import { ApplicationRepository } from '../application.repository';
import { ApplicationFactory } from '../domain/application.factory';
import { ApplicationDomainService } from '../domain/application.domain.service';
import { ApplicationValidator } from '../domain/application.validator';
import { IApplication } from '../domain/interface/application.interface';
import {
  CreateApplicationParam,
  CreateApplicationRet,
  GetApplicationParam,
  GetApplicationRet,
  GetExpectedPaymentParam,
  GetExpectedPaymentRet,
  UpdateApplicationParam,
  UpdateApplicationRet,
} from './dtos';

@Injectable()
export class ApplicationsAppService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly applicationFactory: ApplicationFactory,
    private readonly applicationDomainService: ApplicationDomainService,
    private readonly applicationValidator: ApplicationValidator,
  ) {}

  async createApplication({
    userId,
    competitionId,
    divisionIds,
    player,
  }: CreateApplicationParam): Promise<CreateApplicationRet> {
    const user = (await this.applicationRepository.getUser(userId)) as IApplication.Create.User;

    const competition = (await this.applicationRepository.getCompetition({
      where: { id: competitionId, status: 'ACTIVE' },
      relations: ['divisions', 'divisions.priceSnapshots'],
    })) as IApplication.Create.Competition;

    this.applicationValidator.checkDivisionSuitability(divisionIds, player, competition);

    let application = this.applicationFactory.create(player, user, divisionIds, competition);
    application = await this.applicationRepository.saveApplication(application);
    return { application };
  }

  async getApplication({ userId, applicationId }: GetApplicationParam): Promise<GetApplicationRet> {
    const application = (await this.applicationRepository.getApplication({
      where: { userId, id: applicationId },
      relations: [
        'playerSnapshots',
        'participationDivisions',
        'participationDivisions.particiationDivisionSnapshots',
        'participationDivisions.participationDivisionSnapshots.division',
      ],
    })) as IApplication.Get.Application;
    return { application };
  }

  async getExpectedPayment({ userId, applicationId }: GetExpectedPaymentParam): Promise<GetExpectedPaymentRet> {
    const application = (await this.applicationRepository.getApplication({
      where: { userId, id: applicationId },
      relations: [
        'participationDivisions',
        'participationDivisions.participationDivisionSnapshots',
        'participationDivisions.participationDivisionSnapshots.division',
      ],
    })) as IApplication.CalculatePayment.Application;

    const competition = (await this.applicationRepository.getCompetition({
      where: { id: application.competitionId },
      relations: [
        'divisions',
        'divisions.priceSnapshots',
        'earlybirdDiscountSnapshots',
        'combinationDiscountSnapshots',
      ],
    })) as IApplication.CalculatePayment.Competition;

    const expectedPayment = await this.applicationDomainService.calculatePayment(application, competition);
    return { expectedPayment };
  }

  // TODO: transaction
  async updateApplication({
    userId,
    applicationId,
    player,
    divisionIds,
  }: UpdateApplicationParam): Promise<UpdateApplicationRet> {
    const user = await this.applicationRepository.getUser(userId);
    const application = await this.applicationRepository.getApplication({
      where: { userId, id: applicationId },
      relations: ['participationDivisions', 'participationDivisions.participationDivisionSnapshots'],
    });

    const competition = (await this.applicationRepository.getCompetition({
      where: { id: application.competitionId },
      relations: [
        'divisions',
        'divisions.priceSnapshots',
        'earlybirdDiscountSnapshots',
        'combinationDiscountSnapshots',
      ],
    })) as IApplication.Update.Competition;

    // delete all participationDivisionSnapshots
    // create new participationDivisionSnapshots
    // save application.playerSnapshots
    // save application.participationDivisions
    return { application };
  }
}
