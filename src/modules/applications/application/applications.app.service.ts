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
import { CompetitionModel } from 'src/modules/competitions/domain/model/competition.model';
import { ApplicationModel } from '../domain/model/application.model';

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
    applicationType,
    competitionId,
  }: CreateApplicationParam): Promise<CreateApplicationRet> {
    const user = await this.applicationRepository.getUser(userId);
    const competitionModelProps = await this.applicationRepository.getCompetition({
      where: { id: competitionId, status: 'ACTIVE' },
      relations: ['divisions', 'earlybirdDiscountSnapshots', 'combinationDiscountSnapshots'],
    });
    const competition = new CompetitionModel(competitionModelProps);
    competition.validateApplicationPeriod();
    const divisions = competition.validateParticipationAbleDivisions(participationDivisionIds);

    const application = this.applicationFactory.createApplication(
      user.id,
      competition.id,
      divisions,
      applicationType,
      createPlayerSnapshotDto,
    );
    application.validateApplicationType(user);
    application.validateDivisionSuitability();

    await this.applicationRepository.saveApplication(application);
    return { application };
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
   * - 기존 application 을 DELETEED 상태로 변경하고 새로운 application 을 생성합니다.
   */
  async updateReadyApplication({
    userId,
    createPlayerSnapshotDto,
    applicationId,
    participationDivisionIds,
  }: UpdateReadyApplicationParam): Promise<UpdateReadyApplicationRet> {
    const user = await this.applicationRepository.getUser(userId);
    const applicationProps = await this.applicationRepository.getApplication({
      where: { userId, id: applicationId, status: 'READY' },
      relations: [
        'playerSnapshots',
        'participationDivisionInfos',
        'participationDivisionInfos.participationDivisionInfoSnapshots',
        'participationDivisionInfos.participationDivisionInfoSnapshots.division',
        'participationDivisionInfos.participationDivisionInfoSnapshots.division.priceSnapshots',
      ],
    });
    const oldApplication = new ApplicationModel(applicationProps);
    const competitionModelData = await this.applicationRepository.getCompetition({
      where: { id: applicationProps.competitionId },
      relations: [
        'divisions',
        'divisions.priceSnapshots',
        'earlybirdDiscountSnapshots',
        'combinationDiscountSnapshots',
      ],
    });
    const competition = new CompetitionModel(competitionModelData);
    competition.validateApplicationPeriod();
    const divisions = competition.validateParticipationAbleDivisions(participationDivisionIds);

    const newApplication = this.applicationFactory.createApplication(
      user.id,
      competition.id,
      divisions,
      oldApplication.type,
      createPlayerSnapshotDto,
    );
    newApplication.validateApplicationType(user);
    newApplication.validateDivisionSuitability();

    oldApplication.updateStatusToDeleted();
    // TODO: Transaction
    await this.applicationRepository.saveApplication(oldApplication);
    await this.applicationRepository.saveApplication(newApplication);
    return { application: newApplication };
  }

  /** Update done application. */
  async updateDoneApplication({
    userId,
    applicationId,
    createPlayerSnapshotDto,
    participationDivisionInfoUpdateDataList,
  }: UpdateDoneApplicationParam): Promise<any> {
    // TODO: 에러 표준화
    if (!createPlayerSnapshotDto && !participationDivisionInfoUpdateDataList)
      throw new Error(
        'createPlayerSnapshotDto, participationDivisionInfoUpdateDataList 둘중에 하나는 필수다 이말이야.',
      );
    const user = await this.applicationRepository.getUser(userId);
    const applicationProps = await this.applicationRepository.getApplication({
      where: { userId, id: applicationId, status: 'DONE' },
      relations: [
        'playerSnapshots',
        'participationDivisionInfos',
        'participationDivisionInfos.participationDivisionInfoSnapshots',
        'participationDivisionInfos.participationDivisionInfoSnapshots.division',
        'participationDivisionInfos.participationDivisionInfoSnapshots.division.priceSnapshots',
      ],
    });
    const application = new ApplicationModel(applicationProps);

    const competitionModelData = await this.applicationRepository.getCompetition({
      where: { id: application.competitionId },
      relations: [
        'divisions',
        'divisions.priceSnapshots',
        'earlybirdDiscountSnapshots',
        'combinationDiscountSnapshots',
      ],
    });
    const competition = new CompetitionModel(competitionModelData);
    competition.validateApplicationPeriod();

    if (createPlayerSnapshotDto) {
      const newPlayerSnapshots = this.applicationFactory.createPlayerSnapshot(applicationId, createPlayerSnapshotDto);
      application.addPlayerSnapshot(newPlayerSnapshots);
    }

    if (participationDivisionInfoUpdateDataList) {
      const participationDivisionIds = participationDivisionInfoUpdateDataList.map(
        (participationDivisionInfoUpdateData) => {
          return participationDivisionInfoUpdateData.newParticipationDivisionId;
        },
      );
      const divisions = competition.validateParticipationAbleDivisions(participationDivisionIds);
      const newParticipationDivisionInfoSnapshots = this.applicationFactory.createParticipationDivisionInfoSnapshots(
        divisions,
        participationDivisionInfoUpdateDataList,
      );
      application.addParticipationDivisionInfoSnapshots(newParticipationDivisionInfoSnapshots);
    }

    application.validateApplicationType(user);
    application.validateDivisionSuitability();
    this.applicationRepository.saveApplication(application);
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
