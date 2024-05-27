import { Injectable } from '@nestjs/common';
import { ApplicationFactory } from '../domain/application.factory';
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
import { assert } from 'typia';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { ApplicationsErrors, BusinessException, CommonErrors } from 'src/common/response/errorResponse';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { IApplication, IApplicationWithCompetition } from '../domain/interface/application.interface';
import { UserModel } from 'src/modules/users/domain/model/user.model';
import { UserRepository } from 'src//database/custom-repository/user.repository';
import { ApplicationRepository } from 'src//database/custom-repository/application.repository';
import { CompetitionRepository } from 'src//database/custom-repository/competition.repository';
import { PlayerSnapshotModel } from '../domain/model/player-snapshot.model';
import { ParticipationDivisionInfoSnapshotModel } from '../domain/model/participation-division-info-snapshot.model';
import { ApplicationModel } from '../domain/model/application.model';

@Injectable()
export class ApplicationsAppService {
  constructor(
    private readonly applicationFactory: ApplicationFactory,
    private readonly userRepository: UserRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly competitionRepository: CompetitionRepository,
  ) {}

  /** Create application. */
  async createApplication({
    userId,
    competitionId,
    participationDivisionIds,
    applicationType,
    playerSnapshotCreateDto,
    additionalInfoCreateDtos,
  }: CreateApplicationParam): Promise<CreateApplicationRet> {
    const user = new UserModel(
      assert<IUser>(
        await this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      ),
    );
    const competition = new CompetitionModel(
      assert<ICompetition>(
        await this.competitionRepository
          .findOneOrFail({
            where: { id: competitionId, status: 'ACTIVE' },
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
      ),
    );
    const readyApplication = new ApplicationModel(
      this.applicationFactory.createReadyApplication(
        user,
        competition,
        applicationType,
        participationDivisionIds,
        playerSnapshotCreateDto,
        additionalInfoCreateDtos,
      ),
    );
    competition.validateApplicationPeriod();
    competition.validateAdditionalInfo(additionalInfoCreateDtos);
    readyApplication.validateApplicationType(user.toEntity());
    readyApplication.validateDivisionSuitability();
    readyApplication.caluateExpectedPayment();
    return { application: await this.applicationRepository.save(readyApplication.toEntity()) };
  }

  /** Get application. */
  async getApplication({ userId, applicationId }: GetApplicationParam): Promise<GetApplicationRet> {
    const application = new ApplicationModel(
      assert<IApplicationWithCompetition>(
        await this.applicationRepository
          .findOneOrFail({
            where: { userId, id: applicationId },
            relations: [
              'additionalInfos',
              'playerSnapshots',
              'participationDivisionInfos',
              'participationDivisionInfos.participationDivisionInfoSnapshots',
              'participationDivisionInfos.participationDivisionInfoSnapshots.division',
              'participationDivisionInfos.participationDivisionInfoSnapshots.division.priceSnapshots',
              'competition',
              'competition.divisions',
              'competition.earlybirdDiscountSnapshots',
              'competition.combinationDiscountSnapshots',
              'competition.requiredAdditionalInfos',
              'competition.competitionHostMaps',
            ],
          })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Application not found');
          }),
      ),
    );
    application.caluateExpectedPayment();
    return { application: application.toEntity() };
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
    applicationType,
    participationDivisionIds,
    additionalInfoCreateDtos,
  }: UpdateReadyApplicationParam): Promise<UpdateReadyApplicationRet> {
    const user = new UserModel(
      assert<IUser>(
        await this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      ),
    );
    const oldApplication = new ApplicationModel(
      assert<IApplication>(
        await this.applicationRepository
          .findOneOrFail({
            where: { userId, id: applicationId, status: 'READY' },
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
      ),
    );
    const competition = new CompetitionModel(
      assert<ICompetition>(
        await this.competitionRepository
          .findOneOrFail({
            where: { id: oldApplication.getCompetitionId() },
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
      ),
    );
    const newApplication = new ApplicationModel(
      await this.applicationFactory.createReadyApplication(
        user,
        competition,
        applicationType,
        participationDivisionIds,
        playerSnapshotUpdateDto,
        additionalInfoCreateDtos,
      ),
    );
    competition.validateApplicationPeriod();
    competition.validateAdditionalInfo(additionalInfoCreateDtos);
    newApplication.validateApplicationType(user.toEntity());
    newApplication.validateDivisionSuitability();
    oldApplication.delete();
    // todo!!: Transaction
    await this.applicationRepository.save(oldApplication.toEntity());
    return { application: await this.applicationRepository.save(newApplication.toEntity()) };
  }

  /** Update done application. */
  async updateDoneApplication({
    userId,
    applicationId,
    playerSnapshotUpdateDto,
    participationDivisionInfoUpdateDtos,
    additionalInfoUpdateDtos,
  }: UpdateDoneApplicationParam): Promise<UpdateDoneApplicationRet> {
    if (!playerSnapshotUpdateDto && !participationDivisionInfoUpdateDtos && !additionalInfoUpdateDtos)
      throw new BusinessException(ApplicationsErrors.APPLICATIONS_PLAYER_SNAPSHOT_OR_DIVISION_INFO_REQUIRED);
    const user = new UserModel(
      assert<IUser>(
        await this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      ),
    );
    const application = new ApplicationModel(
      assert<IApplication>(
        await this.applicationRepository
          .findOneOrFail({
            where: { userId, id: applicationId, status: 'DONE' },
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
      ),
    );
    const competition = new CompetitionModel(
      assert<ICompetition>(
        await this.competitionRepository
          .findOneOrFail({
            where: { id: application.getCompetitionId() },
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
      ),
    );
    if (playerSnapshotUpdateDto) {
      application.addPlayerSnapshot(
        new PlayerSnapshotModel(this.applicationFactory.createPlayerSnapshot(applicationId, playerSnapshotUpdateDto)),
      );
    }
    if (participationDivisionInfoUpdateDtos) {
      application.addParticipationDivisionInfoSnapshots(
        this.applicationFactory
          .createManyParticipationDivisionInfoSnapshots(competition, participationDivisionInfoUpdateDtos)
          .map((snapshot) => new ParticipationDivisionInfoSnapshotModel(snapshot)),
      );
    }
    if (additionalInfoUpdateDtos) {
      competition.validateAdditionalInfo(additionalInfoUpdateDtos);
      application.updateAdditionalInfos(additionalInfoUpdateDtos);
    }
    competition.validateApplicationPeriod();
    application.validateApplicationType(user.toEntity());
    application.validateDivisionSuitability();
    return { application: await this.applicationRepository.save(application.toEntity()) };
  }

  /**
   * Get expected payment.
   * - 현재 가격, 할인 정보를 바탕으로 application 의 예상 결제 금액을 계산합니다.
   */
  async getExpectedPayment({ userId, applicationId }: GetExpectedPaymentParam): Promise<GetExpectedPaymentRet> {
    const application = new ApplicationModel(
      assert<IApplication>(
        await this.applicationRepository
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
          }),
      ),
    );
    const competition = new CompetitionModel(
      assert<ICompetition>(
        await this.competitionRepository
          .findOneOrFail({
            where: { id: application.getCompetitionId() },
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
      ),
    );
    return { expectedPayment: competition.calculateExpectedPayment(application.getParticipationDivisionIds()) };
  }

  async findApplications({ userId }: { userId: IUser['id'] }): Promise<IApplication[]> {
    return await this.applicationRepository.find({
      where: { userId },
      take: 10,
      relations: [
        'additionalInfos',
        'playerSnapshots',
        'participationDivisionInfos',
        'participationDivisionInfos.participationDivisionInfoSnapshots',
        'participationDivisionInfos.participationDivisionInfoSnapshots.division',
        'participationDivisionInfos.participationDivisionInfoSnapshots.division.priceSnapshots',
      ],
    });
  }
}
