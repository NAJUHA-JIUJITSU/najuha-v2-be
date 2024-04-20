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

  constructor(value: IApplication.ModelValue.Base) {
    this.id = value.id;
    this.type = value.type;
    this.userId = value.userId;
    this.competitionId = value.competitionId;
    this.createdAt = value.createdAt;
    this.updatedAt = value.updatedAt;
    this.status = value.status;
    this.playerSnapshots = value.playerSnapshots.map((snapshot) => new PlayerSnapshot(snapshot));
    this.participationDivisionInfos = value.participationDivisionInfos.map(
      (info) => new ParticipationDivisionInfo(info),
    );
  }

  abstract toModelValue(): IApplication.ModelValue.Base;

  getCompetitionId() {
    return this.competitionId;
  }

  getType() {
    return this.type;
  }

  validateApplicationType(userValue: IUser) {
    if (this.type === 'PROXY') return;
    const player = this.playerSnapshots[this.playerSnapshots.length - 1];
    player.validateSelfApplication(userValue);
  }

  validateDivisionSuitability() {
    const player = this.playerSnapshots[this.playerSnapshots.length - 1];
    this.participationDivisionInfos.forEach((participationDivisionInfo) => {
      participationDivisionInfo.validateDivisionSuitability(player.birth, player.gender);
    });
  }
}
