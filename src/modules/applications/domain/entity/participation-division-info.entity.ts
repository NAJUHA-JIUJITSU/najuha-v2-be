import { IApplication } from '../interface/application.interface';
import { IParticipationDivisionInfo } from '../interface/participation-division-info.interface';
import { ParticipationDivisionInfoSnapshotEntity } from './participation-division-info-snapshot.entity';

export class ParticipationDivisionInfoEntity {
  public id: IParticipationDivisionInfo['id'];
  public createdAt: IParticipationDivisionInfo['createdAt'];
  public applicationId: IApplication['id'];
  public participationDivisionInfoSnapshots: ParticipationDivisionInfoSnapshotEntity[];

  constructor(participationDivisionInfo: IParticipationDivisionInfo) {
    this.id = participationDivisionInfo.id;
    this.createdAt = participationDivisionInfo.createdAt;
    this.applicationId = participationDivisionInfo.applicationId;
    this.participationDivisionInfoSnapshots = participationDivisionInfo.participationDivisionInfoSnapshots.map(
      (participationDivisionInfoSnapshot) =>
        new ParticipationDivisionInfoSnapshotEntity(participationDivisionInfoSnapshot),
    );
  }
}
