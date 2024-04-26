import { Injectable } from '@nestjs/common';
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
import { ReadyApplicationModel } from '../domain/model/ready-application.model';
import { assert } from 'typia';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/infrastructure/database/entity/user/user.entity';
import { Repository } from 'typeorm';
import { ApplicationEntity } from 'src/infrastructure/database/entity/application/application.entity';
import { CompetitionEntity } from 'src/infrastructure/database/entity/competition/competition.entity';
import { BusinessException, CommonErrors } from 'src/common/response/errorResponse';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { IApplication } from '../domain/interface/application.interface';
import { UserModel } from 'src/modules/users/domain/model/user.model';

@Injectable()
export class ApplicationsAppService {
  constructor(
    private readonly applicationFactory: ApplicationFactory,
    private readonly applicationDomainService: ApplicationDomainService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,
    @InjectRepository(CompetitionEntity)
    private readonly competitionRepository: Repository<CompetitionEntity>,
  ) {}

  /** Create application. */
  async createApplication({
    userId,
    competitionId,
    participationDivisionIds,
    applicationType,
    playerSnapshotCreateDto,
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
            relations: ['divisions', 'earlybirdDiscountSnapshots', 'combinationDiscountSnapshots'],
          })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
          }),
      ),
    );
    competition.validateApplicationPeriod();
    const divisions = competition.validateParticipationAbleDivisions(participationDivisionIds);

    const readyApplication = this.applicationFactory.createReadyApplication(
      user.getId(),
      competition.getId(),
      divisions,
      applicationType,
      playerSnapshotCreateDto,
    );
    readyApplication.validateApplicationType(user.toEntity());
    readyApplication.validateDivisionSuitability();

    return { application: await this.applicationRepository.save(readyApplication.toEntity()) };
  }

  /** Get application. */
  async getApplication({ userId, applicationId }: GetApplicationParam): Promise<GetApplicationRet> {
    const applicationEntity = assert<IApplication>(
      await this.applicationRepository
        .findOneOrFail({
          where: { userId, id: applicationId },
          relations: [
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
    );
    return { application: applicationEntity };
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
    const user = new UserModel(
      assert<IUser>(
        await this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      ),
    );
    const oldApplication = new ReadyApplicationModel(
      assert<IApplication>(
        await this.applicationRepository
          .findOneOrFail({
            where: { userId, id: applicationId, status: 'READY' },
            relations: [
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
            relations: ['divisions', 'earlybirdDiscountSnapshots', 'combinationDiscountSnapshots'],
          })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
          }),
      ),
    );
    competition.validateApplicationPeriod();
    const divisions = competition.validateParticipationAbleDivisions(participationDivisionIds);

    const newApplication = this.applicationFactory.createReadyApplication(
      user.getId(),
      competition.getId(),
      divisions,
      oldApplication.getType(),
      playerSnapshotUpdateDto,
    );
    newApplication.validateApplicationType(user.toEntity());
    newApplication.validateDivisionSuitability();

    oldApplication.updateStatusToDeleted();

    // TODO: Transaction
    await this.applicationRepository.save(oldApplication.toEntity());
    await this.applicationRepository.save(newApplication.toEntity());
    return { application: newApplication.toEntity() };
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
    const user = new UserModel(
      assert<IUser>(
        await this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
      ),
    );
    const application = new DoneApplication(
      assert<IApplication>(
        await this.applicationRepository
          .findOneOrFail({
            where: { userId, id: applicationId, status: 'DONE' },
            relations: [
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
            relations: ['divisions', 'earlybirdDiscountSnapshots', 'combinationDiscountSnapshots'],
          })
          .catch(() => {
            throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
          }),
      ),
    );
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

    application.validateApplicationType(user.toEntity());
    application.validateDivisionSuitability();
    this.applicationRepository.save(application.toEntity());
    return { application: application.toEntity() };
  }

  /**
   * Get expected payment.
   * - 현재 가격, 할인 정보를 바탕으로 application 의 예상 결제 금액을 계산합니다.
   * TOD: domain logic 으로 캡슐화
   */
  async getExpectedPayment({ userId, applicationId }: GetExpectedPaymentParam): Promise<GetExpectedPaymentRet> {
    const applicationEntity = assert<IApplication>(
      await this.applicationRepository
        .findOneOrFail({
          where: { userId, id: applicationId },
          relations: [
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
    );
    const competitionEntity = assert<ICompetition>(
      await this.competitionRepository
        .findOneOrFail({
          where: { id: applicationEntity.competitionId },
          relations: ['divisions', 'earlybirdDiscountSnapshots', 'combinationDiscountSnapshots'],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Competition not found');
        }),
    );
    const expectedPayment = await this.applicationDomainService.calculatePayment(applicationEntity, competitionEntity);
    return { expectedPayment };
  }
}
