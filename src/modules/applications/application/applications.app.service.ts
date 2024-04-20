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
  UpdateDoneApplicationRet,
  UpdateReadyApplicationParam,
  UpdateReadyApplicationRet,
} from './dtos';
import { CompetitionModel } from 'src/modules/competitions/domain/model/competition.model';
import { DoneApplication } from '../domain/model/done-applicatioin.model';
import { ReadyApplication } from '../domain/model/ready-application.model';

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
    competitionId,
    participationDivisionIds,
    applicationType,
    playerSnapshotCreateDto,
  }: CreateApplicationParam): Promise<CreateApplicationRet> {
    const user = await this.applicationRepository.getUser(userId);
    const competitionValue = await this.applicationRepository.getCompetition({
      where: { id: competitionId, status: 'ACTIVE' },
      relations: ['divisions', 'earlybirdDiscountSnapshots', 'combinationDiscountSnapshots'],
    });
    const competition = new CompetitionModel(competitionValue);
    competition.validateApplicationPeriod();
    const divisions = competition.validateParticipationAbleDivisions(participationDivisionIds);

    const application = this.applicationFactory.createReadyApplication(
      user.id,
      competition.id,
      divisions,
      applicationType,
      playerSnapshotCreateDto,
    );
    application.validateApplicationType(user);
    application.validateDivisionSuitability();

    const applicationValue = application.toModelValue();
    await this.applicationRepository.saveApplication(applicationValue);
    return { application: applicationValue };
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
   * - CANCELED, DONE 상태의 application 은 이 api 를 통해 업데이트 할 수 없습니다.
   * - 기존 application 을 DELETEED 상태로 변경하고 새로운 application 을 생성합니다.
   * - 새로운 application을 생성하는 이유, 기존 applicaiton이 실제로는 결제 됐지만 실패처리 된 후, 업데이트시 기존 결제 정보가 남아있어야하기 때문.
   */
  async updateReadyApplication({
    userId,
    playerSnapshotUpdateDto,
    applicationId,
    participationDivisionIds,
  }: UpdateReadyApplicationParam): Promise<UpdateReadyApplicationRet> {
    const userValue = await this.applicationRepository.getUser(userId);
    const oldApplicationValue = await this.applicationRepository.getApplication({
      where: { userId, id: applicationId, status: 'READY' },
      relations: [
        'playerSnapshots',
        'participationDivisionInfos',
        'participationDivisionInfos.participationDivisionInfoSnapshots',
        'participationDivisionInfos.participationDivisionInfoSnapshots.division',
        'participationDivisionInfos.participationDivisionInfoSnapshots.division.priceSnapshots',
      ],
    });
    const oldApplication = new ReadyApplication(oldApplicationValue);
    const competitionValue = await this.applicationRepository.getCompetition({
      where: { id: oldApplication.getCompetitionId() },
      relations: [
        'divisions',
        'divisions.priceSnapshots',
        'earlybirdDiscountSnapshots',
        'combinationDiscountSnapshots',
      ],
    });
    const competition = new CompetitionModel(competitionValue);
    competition.validateApplicationPeriod();
    const divisions = competition.validateParticipationAbleDivisions(participationDivisionIds);

    const newApplication = this.applicationFactory.createReadyApplication(
      userValue.id,
      competition.id,
      divisions,
      oldApplication.getType(),
      playerSnapshotUpdateDto,
    );
    newApplication.validateApplicationType(userValue);
    newApplication.validateDivisionSuitability();

    oldApplication.updateStatusToDeleted();

    // TODO: Transaction
    await this.applicationRepository.saveApplication(oldApplication.toModelValue());
    await this.applicationRepository.saveApplication(newApplication.toModelValue());
    return { application: newApplication.toModelValue() };
  }

  /** Update done application. */
  async updateDoneApplication({
    userId,
    applicationId,
    playerSnapshotUpdateDto,
    participationDivisionInfoUpdateDtos,
  }: UpdateDoneApplicationParam): Promise<UpdateDoneApplicationRet> {
    if (!playerSnapshotUpdateDto && !participationDivisionInfoUpdateDtos)
      throw new Error(
        'playerSnapshotCreateDto, participationDivisionInfoUpdateDataList 둘중에 하나는 필수다 이말이야.',
      ); // TODO: 에러 표준화
    const userValue = await this.applicationRepository.getUser(userId);
    const applicationValue = await this.applicationRepository.getApplication({
      where: { userId, id: applicationId, status: 'DONE' },
      relations: [
        'playerSnapshots',
        'participationDivisionInfos',
        'participationDivisionInfos.participationDivisionInfoSnapshots',
        'participationDivisionInfos.participationDivisionInfoSnapshots.division',
        'participationDivisionInfos.participationDivisionInfoSnapshots.division.priceSnapshots',
      ],
    });
    const application = new DoneApplication(applicationValue);
    const competitionValue = await this.applicationRepository.getCompetition({
      where: { id: application.getCompetitionId() },
      relations: [
        'divisions',
        'divisions.priceSnapshots',
        'earlybirdDiscountSnapshots',
        'combinationDiscountSnapshots',
      ],
    });
    const competition = new CompetitionModel(competitionValue);
    competition.validateApplicationPeriod();

    if (playerSnapshotUpdateDto) {
      const newPlayerSnapshot = this.applicationFactory.createPlayerSnapshot(applicationId, playerSnapshotUpdateDto);
      application.addPlayerSnapshot(newPlayerSnapshot);
    }

    if (participationDivisionInfoUpdateDtos) {
      const participationDivisionIds = participationDivisionInfoUpdateDtos.map((dto) => dto.newParticipationDivisionId);
      const divisions = competition.validateParticipationAbleDivisions(participationDivisionIds);
      const newParticipationDivisionInfoSnapshots = this.applicationFactory.createParticipationDivisionInfoSnapshots(
        divisions,
        participationDivisionInfoUpdateDtos,
      );
      newParticipationDivisionInfoSnapshots.forEach((snapshot) => {
        application.updateParticipationDivisionInfo(snapshot.participationDivisionInfoId, snapshot);
      });
    }

    application.validateApplicationType(userValue);
    application.validateDivisionSuitability();
    this.applicationRepository.saveApplication(application.toModelValue());
    return { application: application.toModelValue() };
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
