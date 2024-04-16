import { Injectable } from '@nestjs/common';
import { ApplicationRepository } from '../application.repository';
import { ApplicationFactory } from '../domain/application.factory';
import { ApplicationDomainService } from '../domain/application.domain.service';
import {
  CreateApplicationParam,
  CreateApplicationRet,
  GetApplicationParam,
  GetApplicationRet,
  GetExpectedPaymentParam,
  GetExpectedPaymentRet,
  UpdateDoneApplicationParam,
  UpdateReadyApplicationParam,
  UpdateReadyApplicationRet,
} from './dtos';
import { CompetitionEntity } from 'src/modules/competitions/domain/entity/competition.entity';
import { ApplicationEntity } from '../domain/entity/application.entity';

@Injectable()
export class ApplicationsAppService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly applicationFactory: ApplicationFactory,
    private readonly applicationDomainService: ApplicationDomainService,
  ) {}

  /** Create application. */
  async createApplication({
    userId,
    createPlayerSnapshotDto,
    participationDivisionIds,
    competitionId,
  }: CreateApplicationParam): Promise<CreateApplicationRet> {
    const user = await this.applicationRepository.getUser(userId);
    const competitionEntityData = await this.applicationRepository.getCompetition({
      where: { id: competitionId, status: 'ACTIVE' },
      relations: ['divisions', 'earlybirdDiscountSnapshots', 'combinationDiscountSnapshots'],
    });
    const competition = new CompetitionEntity(competitionEntityData);

    competition.validateApplicationAbility(createPlayerSnapshotDto, participationDivisionIds);

    const applicationEntityData = this.applicationFactory.createApplication(
      user,
      createPlayerSnapshotDto,
      participationDivisionIds,
      competitionEntityData,
    );

    await this.applicationRepository.saveApplication(applicationEntityData);
    return { application: applicationEntityData };
  }

  /** Get application. */
  async getApplication({ userId, applicationId }: GetApplicationParam): Promise<GetApplicationRet> {
    const application = await this.applicationRepository.getApplication({
      where: { userId, id: applicationId },
      relations: [
        'playerSnapshots',
        'participationDivisionInfos',
        'participationDivisionInfos.participationDivisionInfoSnapshots',
        'participationDivisionInfos.participationDivisionInfoSnapshots.division',
        'participationDivisionInfos.participationDivisionInfoSnapshots.division.priceSnapshots',
      ],
    });
    return { application };
  }

  /**
   * Update ready application.
   * - READY status 를 가진 application 을 업데이트 합니다.
   * - CANCELED, DONE 상태의 application 은 업데이트 할 수 없습니다.
   * - 기존 ParticipationDivisionInfos 를 삭제하고 새로운 ParticipationDivisionInfos 를 생성합니다.
   * TODO: Transaction
   */
  async updateReadyApplication({
    userId,
    createPlayerSnapshotDto,
    applicationId,
    participationDivisionIds,
  }: UpdateReadyApplicationParam): Promise<UpdateReadyApplicationRet> {
    const user = await this.applicationRepository.getUser(userId);

    const applicationEntityData = await this.applicationRepository.getApplication({
      where: { userId, id: applicationId, status: 'READY' },
      relations: [
        'playerSnapshots',
        'participationDivisionInfos',
        'participationDivisionInfos.participationDivisionInfoSnapshots',
        'participationDivisionInfos.participationDivisionInfoSnapshots.division',
        'participationDivisionInfos.participationDivisionInfoSnapshots.division.priceSnapshots',
      ],
    });
    const application = new ApplicationEntity(applicationEntityData);

    const competitionEntityData = await this.applicationRepository.getCompetition({
      where: { id: application.competitionId },
      relations: [
        'divisions',
        'divisions.priceSnapshots',
        'earlybirdDiscountSnapshots',
        'combinationDiscountSnapshots',
      ],
    });
    const competition = new CompetitionEntity(competitionEntityData);
    competition.validateApplicationAbility(createPlayerSnapshotDto, participationDivisionIds);
    await this.applicationRepository.deletePlayerSnapshots(application.playerSnapshots);
    await this.applicationRepository.deleteParticipationDivisionInfos(application.participationDivisionInfos);
    const newPlayerSnapshot = this.applicationFactory.createPlayerSnapshot(
      user,
      createPlayerSnapshotDto,
      applicationId,
    );
    const newParticipationDivisionInfos = this.applicationFactory.createParticipationDivisionInfos(
      participationDivisionIds,
      competition.divisions,
      applicationId,
    );
    application.updateReadyApplication(newPlayerSnapshot, newParticipationDivisionInfos);
    await this.applicationRepository.saveApplication(application);
    return { application };
  }

  /** Update done application. */
  async updateDoneApplication({
    userId,
    applicationId,
    createPlayerSnapshotDto,
    participationDivisionInfoUpdateDataList,
  }: UpdateDoneApplicationParam): Promise<any> {
    const user = await this.applicationRepository.getUser(userId);
    const applicationEntityData = await this.applicationRepository.getApplication({
      where: { userId, id: applicationId, status: 'DONE' },
      relations: [
        'playerSnapshots',
        'participationDivisionInfos',
        'participationDivisionInfos.participationDivisionInfoSnapshots',
        'participationDivisionInfos.participationDivisionInfoSnapshots.division',
        'participationDivisionInfos.participationDivisionInfoSnapshots.division.priceSnapshots',
      ],
    });
    const application = new ApplicationEntity(applicationEntityData);
    const competitionEntityData = await this.applicationRepository.getCompetition({
      where: { id: application.competitionId },
      relations: [
        'divisions',
        'divisions.priceSnapshots',
        'earlybirdDiscountSnapshots',
        'combinationDiscountSnapshots',
      ],
    });
    const competition = new CompetitionEntity(competitionEntityData);
    competition.validateApplicationAbility(
      createPlayerSnapshotDto,
      participationDivisionInfoUpdateDataList.map((participationDivisionInfoUpdateData) => {
        return participationDivisionInfoUpdateData.newParticipationDivisionId;
      }),
    );
    const newPlayerSnapshots = this.applicationFactory.createPlayerSnapshot(
      user,
      createPlayerSnapshotDto,
      applicationId,
    );
    const newParticipationDivisionInfoSnapshots = this.applicationFactory.createParticipationDivisionInfoSnapshots(
      competition.divisions,
      participationDivisionInfoUpdateDataList,
    );
    application.updateDoneApplication(newPlayerSnapshots, newParticipationDivisionInfoSnapshots);
    await this.applicationRepository.saveApplication(application);
    return { application };
  }

  /**
   * Get expected payment.
   * - 현재 가격, 할인 정보를 바탕으로 application 의 예상 결제 금액을 계산합니다.
   */
  async getExpectedPayment({ userId, applicationId }: GetExpectedPaymentParam): Promise<GetExpectedPaymentRet> {
    const application = await this.applicationRepository.getApplication({
      where: { userId, id: applicationId },
      relations: [
        'participationDivisionInfos',
        'participationDivisionInfos.participationDivisionInfoSnapshots',
        'participationDivisionInfos.participationDivisionInfoSnapshots.division',
        'participationDivisionInfos.participationDivisionInfoSnapshots.division.priceSnapshots',
      ],
    });

    const competition = await this.applicationRepository.getCompetition({
      where: { id: application.competitionId },
      relations: [
        'divisions',
        'divisions.priceSnapshots',
        'earlybirdDiscountSnapshots',
        'combinationDiscountSnapshots',
      ],
    });

    const expectedPayment = await this.applicationDomainService.calculatePayment(application, competition);
    return { expectedPayment };
  }
}
