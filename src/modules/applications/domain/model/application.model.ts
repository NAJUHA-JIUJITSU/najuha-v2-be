import { IApplication } from '../interface/application.interface';
import { PlayerSnapshotModel } from './player-snapshot.model';
import { ParticipationDivisionInfoModel } from './participation-division-info.model';
import { IUser } from '../../../users/domain/interface/user.interface';
import { AdditionalInfoModel } from './additional-info.model';
import { ParticipationDivisionInfoSnapshotModel } from './participation-division-info-snapshot.model';
import { ApplicationsErrors, BusinessException } from '../../../../common/response/errorResponse';
import { IAdditionalInfoUpdateDto } from '../interface/additional-info.interface';
import { IExpectedPayment } from '../interface/expected-payment.interface';

export class ApplicationModel {
  private readonly id: IApplication['id'];
  private readonly type: IApplication['type'];
  private readonly competitionId: IApplication['competitionId'];
  private readonly userId: IApplication['userId'];
  private readonly createdAt: IApplication['createdAt'];
  private readonly updatedAt: IApplication['updatedAt'];
  private readonly playerSnapshots: PlayerSnapshotModel[];
  private readonly participationDivisionInfos: ParticipationDivisionInfoModel[];
  private readonly additionaInfos: AdditionalInfoModel[];
  private status: IApplication['status'];
  private deletedAt: IApplication['deletedAt'];
  private expectedPayment: IExpectedPayment | null;

  constructor(entity: IApplication) {
    this.id = entity.id;
    this.type = entity.type;
    this.userId = entity.userId;
    this.competitionId = entity.competitionId;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.deletedAt = entity.deletedAt;
    this.status = entity.status;
    this.playerSnapshots = entity.playerSnapshots.map((snapshot) => new PlayerSnapshotModel(snapshot));
    this.participationDivisionInfos = entity.participationDivisionInfos.map(
      (info) => new ParticipationDivisionInfoModel(info),
    );
    this.additionaInfos = entity.additionalInfos.map((info) => new AdditionalInfoModel(info));
    this.expectedPayment = null;
  }

  toEntity(): IApplication {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      type: this.type,
      status: this.status,
      competitionId: this.competitionId,
      userId: this.userId,
      playerSnapshots: this.playerSnapshots.map((snapshot) => snapshot.toEntity()),
      participationDivisionInfos: this.participationDivisionInfos.map((info) => info.toEntity()),
      additionalInfos: this.additionaInfos.map((info) => info.toEntity()),
      expectedPayment: this.expectedPayment,
    };
  }

  getId() {
    return this.id;
  }

  getType() {
    return this.type;
  }

  getStatus() {
    return this.status;
  }

  getCompetitionId() {
    return this.competitionId;
  }

  getLatestPlayerSnapshot() {
    return this.playerSnapshots[this.playerSnapshots.length - 1];
  }

  getParticipationDivisionIds() {
    return this.participationDivisionInfos.map((info) => info.getLatestParticipationDivisionInfoSnapshot().division.id);
  }

  validateApplicationType(userEntity: IUser) {
    if (this.type === 'PROXY') return;
    const player = this.getLatestPlayerSnapshot();
    player.validateSelfApplication(userEntity);
  }

  validateDivisionSuitability() {
    const player = this.getLatestPlayerSnapshot();
    this.participationDivisionInfos.forEach((participationDivisionInfo) => {
      participationDivisionInfo.validateDivisionSuitability(player.birth, player.gender);
    });
  }

  // READY Status -------------------------------------------------------------
  delete() {
    // todo!!: 에러 표준화
    if (this.status !== 'READY') throw new Error('Application status is not READY');
    this.deletedAt = new Date();
  }

  setExpectedPayment(expectedPayment: IExpectedPayment) {
    if (this.status !== 'READY') throw new Error('Application status is not READY');
    this.expectedPayment = expectedPayment;
  }

  // DONE Status --------------------------------------------------------------
  addPlayerSnapshot(newPlayerSnapshot: PlayerSnapshotModel) {
    // todo!!: 에러 표준화
    if (this.status !== 'DONE') throw new Error('Application status is not DONE');
    this.playerSnapshots.push(newPlayerSnapshot);
  }

  addParticipationDivisionInfoSnapshots(
    newParticipationDivisionInfoSnapshots: ParticipationDivisionInfoSnapshotModel[],
  ) {
    // todo!!: 에러 표준화
    if (this.status !== 'DONE') throw new Error('Application status is not DONE');
    newParticipationDivisionInfoSnapshots.forEach((snapshot) => {
      const participationDivisionInfo = this.participationDivisionInfos.find(
        (info) => info.getId() === snapshot.participationDivisionInfoId,
      );
      if (!participationDivisionInfo)
        throw new BusinessException(ApplicationsErrors.APPLICATIONS_PARTICIPATION_DIVISION_INFO_NOT_FOUND);
      participationDivisionInfo.addParticipationDivisionInfoSnapshot(snapshot);
    });
  }

  updateAdditionalInfos(additionalInfoUpdateDtos: IAdditionalInfoUpdateDto[]) {
    // todo!!: 에러 표준화
    if (this.status !== 'DONE') throw new Error('Application status is not DONE');
    additionalInfoUpdateDtos.forEach((updateDto) => {
      const additionalInfo = this.additionaInfos.find((info) => info.getType() === updateDto.type);
      if (!additionalInfo) throw new BusinessException(ApplicationsErrors.APPLICATIONS_ADDITIONAL_INFO_NOT_FOUND);
      additionalInfo.updateValue(updateDto.value);
    });
  }
}
