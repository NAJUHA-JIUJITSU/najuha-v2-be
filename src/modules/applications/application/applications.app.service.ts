import { Injectable } from '@nestjs/common';
import { ApplicationFactory } from '../domain/application.factory';
import {
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
import { IUser } from '../../users/domain/interface/user.interface';
import { ApplicationsErrors, BusinessException, CommonErrors } from '../../../common/response/errorResponse';
import { ICompetition } from '../../competitions/domain/interface/competition.interface';
import { IApplication } from '../domain/interface/application.interface';
import { UserModel } from '../../users/domain/model/user.model';
import { UserRepository } from '../../../database/custom-repository/user.repository';
import { ApplicationRepository } from '../../../database/custom-repository/application.repository';
import { CompetitionRepository } from '../../../database/custom-repository/competition.repository';
import { PlayerSnapshotModel } from '../domain/model/player-snapshot.model';
import { ParticipationDivisionInfoSnapshotModel } from '../domain/model/participation-division-info-snapshot.model';
import { ApplicationModel } from '../domain/model/application.model';
import { In } from 'typeorm';

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
    const user = new UserModel(
      assert<IUser>(
        await this.userRepository
          .findOneOrFail({
            where: { id: applicationCreateDto.userId },
            relations: ['profileImages', 'profileImages.image'],
          })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
          }),
      ),
    );
    const competition = new CompetitionModel(
      assert<ICompetition>(
        await this.competitionRepository
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
      ),
    );
    const readyApplication = new ApplicationModel(
      this.applicationFactory.createReadyApplication(competition, applicationCreateDto),
    );
    competition.validateApplicationPeriod();
    competition.validateAdditionalInfo(applicationCreateDto.additionalInfoCreateDtos);
    readyApplication.validateApplicationType(user.toData());
    readyApplication.validateDivisionSuitability();
    readyApplication.setExpectedPayment(
      competition.calculateExpectedPayment(readyApplication.getParticipationDivisionIds()),
    );
    return { application: await this.applicationRepository.save(readyApplication.toData()) };
  }

  /** Get application. */
  async getApplication({ userId, applicationId }: GetApplicationParam): Promise<GetApplicationRet> {
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
    application.setExpectedPayment(competition.calculateExpectedPayment(application.getParticipationDivisionIds()));
    return { application: application.toData() };
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
    const user = new UserModel(
      assert<IUser>(
        await this.userRepository
          .findOneOrFail({
            where: { id: applicationCreateDto.userId },
            relations: ['profileImages', 'profileImages.image'],
          })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
          }),
      ),
    );
    const oldApplication = new ApplicationModel(
      assert<IApplication>(
        await this.applicationRepository
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
      this.applicationFactory.createReadyApplication(competition, {
        ...applicationCreateDto,
      }),
    );
    competition.validateApplicationPeriod();
    competition.validateAdditionalInfo(applicationCreateDto.additionalInfoCreateDtos);
    newApplication.validateApplicationType(user.toData());
    newApplication.validateDivisionSuitability();
    oldApplication.delete();
    // todo!!: Transaction
    await this.applicationRepository.save(oldApplication.toData());
    newApplication.setExpectedPayment(
      competition.calculateExpectedPayment(newApplication.getParticipationDivisionIds()),
    );
    return { application: await this.applicationRepository.save(newApplication.toData()) };
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

    const user = new UserModel(
      assert<IUser>(
        await this.userRepository
          .findOneOrFail({ where: { id: userId }, relations: ['profileImages', 'profileImages.image'] })
          .catch(() => {
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
    if (doneApplicationUpdateDto.playerSnapshotCreateDto) {
      application.addPlayerSnapshot(
        new PlayerSnapshotModel(
          this.applicationFactory.createPlayerSnapshot(applicationId, doneApplicationUpdateDto.playerSnapshotCreateDto),
        ),
      );
    }
    if (doneApplicationUpdateDto.participationDivisionInfoUpdateDtos) {
      application.addParticipationDivisionInfoSnapshots(
        this.applicationFactory
          .createManyParticipationDivisionInfoSnapshots(
            competition,
            doneApplicationUpdateDto.participationDivisionInfoUpdateDtos,
          )
          .map((snapshot) => new ParticipationDivisionInfoSnapshotModel(snapshot)),
      );
    }
    if (doneApplicationUpdateDto.additionalInfoUpdateDtos) {
      competition.validateAdditionalInfo(doneApplicationUpdateDto.additionalInfoUpdateDtos);
      application.updateAdditionalInfos(doneApplicationUpdateDto.additionalInfoUpdateDtos);
    }
    competition.validateApplicationPeriod();
    application.validateApplicationType(user.toData());
    application.validateDivisionSuitability();
    return { application: await this.applicationRepository.save(application.toData()) };
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

  async findApplications({ userId, status, page, limit }: FindApplicationsParam): Promise<FindApplicationsRet> {
    const applications = assert<IApplication[]>(
      await this.applicationRepository.find({
        where: { userId, status },
        relations: [
          'additionalInfos',
          'playerSnapshots',
          'participationDivisionInfos',
          'participationDivisionInfos.participationDivisionInfoSnapshots',
          'participationDivisionInfos.participationDivisionInfoSnapshots.division',
          'participationDivisionInfos.participationDivisionInfoSnapshots.division.priceSnapshots',
        ],
        order: { createdAt: 'DESC' },
        skip: page * limit,
        take: limit,
      }),
    ).map((applicationEntity) => new ApplicationModel(applicationEntity));
    const competitions = assert<ICompetition[]>(
      await this.competitionRepository.find({
        where: { id: In(applications.map((application) => application.getCompetitionId())) },
        relations: [
          'divisions',
          'divisions.priceSnapshots',
          'earlybirdDiscountSnapshots',
          'combinationDiscountSnapshots',
          'requiredAdditionalInfos',
          'competitionHostMaps',
        ],
      }),
    ).map((competitionEntity) => new CompetitionModel(competitionEntity));
    applications.forEach((application) => {
      const competition = competitions.find((competition) => competition.getId() === application.getCompetitionId());
      if (!competition) throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
      if (application.getStatus() === 'READY')
        application.setExpectedPayment(competition.calculateExpectedPayment(application.getParticipationDivisionIds()));
    });
    let ret: FindApplicationsRet = { applications: applications.map((application) => application.toData()) };
    if (applications.length === limit) {
      ret = { ...ret, nextPage: page + 1 };
    }
    return ret;
  }
}
