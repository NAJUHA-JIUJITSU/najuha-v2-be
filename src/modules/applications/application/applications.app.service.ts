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
  UpdateReadyApplicationParam,
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
    player,
    divisionIds,
    competitionId,
  }: CreateApplicationParam): Promise<CreateApplicationRet> {
    const user = (await this.applicationRepository.getUser(userId)) as IApplication.Create.User;

    const competition = (await this.applicationRepository.getCompetition({
      where: { id: competitionId, status: 'ACTIVE' },
      relations: ['divisions', 'divisions.priceSnapshots'],
    })) as IApplication.Create.Competition;

    this.applicationValidator.validateApplicationAbility(player, divisionIds, competition);

    const application = this.applicationFactory.createApplication(user, player, divisionIds, competition);
    await this.applicationRepository.saveApplication(application);
    return { application };
  }

  async getApplication({ userId, applicationId }: GetApplicationParam): Promise<GetApplicationRet> {
    const application = (await this.applicationRepository.getApplication({
      where: { userId, id: applicationId },
      relations: [
        'playerSnapshots',
        'participationDivisions',
        'participationDivisions.participationDivisionSnapshots',
        'participationDivisions.participationDivisionSnapshots.division',
      ],
    })) as IApplication.Get.Application;
    return { application };
  }

  /**
   * - Update ready application.
   * - READY status 를 가진 application 을 업데이트 합니다.
   * - CANCELED, DONE 상태의 application 은 업데이트 할 수 없습니다.
   * - 기존 participationDivisions 를 삭제하고 새로운 participationDivisions 를 생성합니다.
   */
  async updateReadyApplication({
    userId,
    player,
    applicationId,
    divisionIds,
  }: UpdateReadyApplicationParam): Promise<UpdateApplicationRet> {
    const application = (await this.applicationRepository.getApplication({
      where: { userId, id: applicationId, status: 'READY' },
      relations: ['playerSnapshots', 'participationDivisions', 'participationDivisions.participationDivisionSnapshots'],
    })) as IApplication.UpdateReadyApplication.Application;

    const competition = (await this.applicationRepository.getCompetition({
      where: { id: application.competitionId },
      relations: [
        'divisions',
        'divisions.priceSnapshots',
        'earlybirdDiscountSnapshots',
        'combinationDiscountSnapshots',
      ],
    })) as IApplication.UpdateReadyApplication.Competition;

    this.applicationValidator.validateApplicationAbility(player, divisionIds, competition);

    const playerSnapshot = { ...application.playerSnapshots[application.playerSnapshots.length - 1], ...player };
    const participationDivisions = this.applicationFactory.createParticipationDivisions(
      divisionIds,
      competition,
      application.id,
    );
    application.playerSnapshots = [playerSnapshot];
    application.participationDivisions = participationDivisions;

    // TODO: delete old participationDivisions
    await this.applicationRepository.saveParticipationDivisions(participationDivisions);
    await this.applicationRepository.savePlayerSnapshot(playerSnapshot);

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
}
