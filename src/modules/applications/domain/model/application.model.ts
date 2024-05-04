import { IApplication } from '../interface/application.interface';
import { PlayerSnapshotModel } from './player-snapshot.model';
import { ParticipationDivisionInfoModel } from './participation-division-info.model';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { AdditionalInfoModel } from './additional-info.model';

export abstract class ApplicationModel {
  protected readonly id: IApplication['id'];
  protected readonly type: IApplication['type'];
  protected readonly competitionId: IApplication['competitionId'];
  protected readonly userId: IApplication['userId'];
  protected readonly createdAt: IApplication['createdAt'];
  protected readonly updatedAt: IApplication['updatedAt'];
  protected readonly playerSnapshots: PlayerSnapshotModel[];
  protected readonly participationDivisionInfos: ParticipationDivisionInfoModel[];
  protected readonly additionaInfos: AdditionalInfoModel[];
  protected status: IApplication['status'];

  constructor(entity: IApplication) {
    this.id = entity.id;
    this.type = entity.type;
    this.userId = entity.userId;
    this.competitionId = entity.competitionId;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.status = entity.status;
    this.playerSnapshots = entity.playerSnapshots.map((snapshot) => new PlayerSnapshotModel(snapshot));
    this.participationDivisionInfos = entity.participationDivisionInfos.map(
      (info) => new ParticipationDivisionInfoModel(info),
    );
    this.additionaInfos = entity.additionalInfos.map((info) => new AdditionalInfoModel(info));
  }

  abstract toEntity(): IApplication;

  getId() {
    return this.id;
  }

  getType() {
    return this.type;
  }

  getCompetitionId() {
    return this.competitionId;
  }

  validateApplicationType(userEntity: IUser) {
    if (this.type === 'PROXY') return;
    const player = this.playerSnapshots[this.playerSnapshots.length - 1];
    player.validateSelfApplication(userEntity);
  }

  validateDivisionSuitability() {
    const player = this.playerSnapshots[this.playerSnapshots.length - 1];
    this.participationDivisionInfos.forEach((participationDivisionInfo) => {
      participationDivisionInfo.validateDivisionSuitability(player.birth, player.gender);
    });
  }
}
