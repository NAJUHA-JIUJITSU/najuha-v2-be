import { IApplication } from '../interface/application.interface';
import { IParticipationDivisionInfo } from '../interface/participation-division-info.interface';
import { ParticipationDivisionInfoSnapshotModel } from './participation-division-info-snapshot.model';

export class ParticipationDivisionInfoModel {
  public id: IParticipationDivisionInfo['id'];
  public createdAt: IParticipationDivisionInfo['createdAt'];
  public applicationId: IApplication['id'];
  public participationDivisionInfoSnapshots: ParticipationDivisionInfoSnapshotModel[];

  constructor(participationDivisionInfo: IParticipationDivisionInfo) {
    this.id = participationDivisionInfo.id;
    this.createdAt = participationDivisionInfo.createdAt;
    this.applicationId = participationDivisionInfo.applicationId;
    this.participationDivisionInfoSnapshots = participationDivisionInfo.participationDivisionInfoSnapshots.map(
      (participationDivisionInfoSnapshot) =>
        new ParticipationDivisionInfoSnapshotModel(participationDivisionInfoSnapshot),
    );
  }
}
