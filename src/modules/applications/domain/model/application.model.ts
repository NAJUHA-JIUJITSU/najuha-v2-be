import { IApplication } from '../interface/application.interface';
import { PlayerSnapshot } from './player-snapshot.model';
import { ParticipationDivisionInfo } from './participation-division-info.model';
import { IUser } from 'src/modules/users/domain/interface/user.interface';

export abstract class Application {
  protected id: IApplication['id'];
  protected userId: IApplication['userId'];
  protected competitionId: IApplication['competitionId'];
  protected createdAt: IApplication['createdAt'];
  protected updatedAt: IApplication['updatedAt'];
  protected type: IApplication['type'];
  protected status: IApplication['status'];
  protected playerSnapshots: PlayerSnapshot[];
  protected participationDivisionInfos: ParticipationDivisionInfo[];

  constructor(entity: IApplication.Entity.Base) {
    this.id = entity.id;
    this.type = entity.type;
    this.userId = entity.userId;
    this.competitionId = entity.competitionId;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.status = entity.status;
    this.playerSnapshots = entity.playerSnapshots.map((snapshot) => new PlayerSnapshot(snapshot));
    this.participationDivisionInfos = entity.participationDivisionInfos.map(
      (info) => new ParticipationDivisionInfo(info),
    );
  }

  abstract toEntity(): IApplication.Entity.Base;

  getCompetitionId() {
    return this.competitionId;
  }

  getType() {
    return this.type;
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
