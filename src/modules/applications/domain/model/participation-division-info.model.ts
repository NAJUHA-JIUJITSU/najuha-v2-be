import { IApplication } from '../interface/application.interface';
import { IParticipationDivisionInfo } from '../interface/participation-division-info.interface';
import { ParticipationDivisionInfoSnapshotModel } from './participation-division-info-snapshot.model';

export class ParticipationDivisionInfoModel {
  public id: IParticipationDivisionInfo['id'];
  public createdAt: IParticipationDivisionInfo['createdAt'];
  public applicationId: IApplication['id'];
  public participationDivisionInfoSnapshots: ParticipationDivisionInfoSnapshotModel[];

  constructor(props: IParticipationDivisionInfo) {
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.applicationId = props.applicationId;
    this.participationDivisionInfoSnapshots = props.participationDivisionInfoSnapshots.map(
      (snapshot) => new ParticipationDivisionInfoSnapshotModel(snapshot),
    );
  }
}
