import { IApplication } from '../interface/application.interface';
import { PlayerSnapshotModel } from './player-snapshot.model';
import { ParticipationDivisionInfoModel } from './participation-division-info.model';
import { ParticipationDivisionInfoSnapshotModel } from './participation-division-info-snapshot.model';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { IParticipationDivisionInfo } from '../interface/participation-division-info.interface';

export class ApplicationModel {
  private id: IApplication['id'];
  private userId: IApplication['userId'];
  private competitionId: IApplication['competitionId'];
  private createdAt: IApplication['createdAt'];
  private updatedAt: IApplication['updatedAt'];
  private type: IApplication['type'];
  private status: IApplication['status'];
  private playerSnapshots: PlayerSnapshotModel[];
  private participationDivisionInfos: ParticipationDivisionInfoModel[];

  constructor(props: IApplication) {
    this.id = props.id;
    this.type = props.type;
    this.userId = props.userId;
    this.competitionId = props.competitionId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.status = props.status;
    this.playerSnapshots = props.playerSnapshots.map((snapshot) => new PlayerSnapshotModel(snapshot));
    this.participationDivisionInfos = props.participationDivisionInfos.map(
      (info) => new ParticipationDivisionInfoModel(info),
    );
  }

  getCompetitionId() {
    return this.competitionId;
  }

  getType() {
    return this.type;
  }

  validateApplicationType(user: IUser) {
    if (this.type === 'PROXY') return;
    const player = this.playerSnapshots[this.playerSnapshots.length - 1];
    const mismatchs: string[] = [];
    if (player.name !== user.name) mismatchs.push('name');
    if (player.phoneNumber !== user.phoneNumber) mismatchs.push('phoneNumber');
    if (player.birth !== user.birth) mismatchs.push('birth');
    if (player.gender !== user.gender) mismatchs.push('gender');
    // TODO: 에러 표준화
    if (mismatchs.length > 0) throw new Error(`Mismatched fields: ${mismatchs.join(', ')}`);
  }

  validateDivisionSuitability() {
    const player = this.playerSnapshots[this.playerSnapshots.length - 1];
    this.participationDivisionInfos.forEach((participationDivisionInfo) => {
      participationDivisionInfo.validateDivisionSuitability(player.birth, player.gender);
    });
  }

  updateStatusToDeleted() {
    if (this.status !== 'READY') throw new Error('Only READY application can be deleted');
    this.status = 'DELETED';
  }

  addPlayerSnapshot(newPlayerSnapshot: PlayerSnapshotModel) {
    if (this.status !== 'DONE') throw new Error('Only DONE application can add player snapshot');
    this.playerSnapshots.push(newPlayerSnapshot);
  }

  updateParticipationDivisionInfo(
    participationDivisionInfoId: IParticipationDivisionInfo['id'],
    newParticipationDivisionInfoSnapshot: ParticipationDivisionInfoSnapshotModel,
  ) {
    if (this.status !== 'DONE') throw new Error('Only DONE application can add participation division info snapshots');
    const participationDivisionInfo = this.participationDivisionInfos.find(
      (info) => info.getId() === participationDivisionInfoId,
    );
    if (!participationDivisionInfo) throw new Error('Participation division info not found');
    participationDivisionInfo.addParticipationDivisionInfoSnapshot(newParticipationDivisionInfoSnapshot);
  }

  toValue(): IApplication {
    return {
      id: this.id,
      userId: this.userId,
      competitionId: this.competitionId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      type: this.type,
      status: this.status,
      playerSnapshots: this.playerSnapshots.map((snapshot) => snapshot.toValue()),
      participationDivisionInfos: this.participationDivisionInfos.map((info) => info.toValue()),
    };
  }
}
