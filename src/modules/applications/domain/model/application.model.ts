import { IApplication } from '../interface/application.interface';
import { PlayerSnapshotModel } from './player-snapshot.model';
import { ParticipationDivisionInfoModel } from './participation-division-info.model';
import { ParticipationDivisionInfoSnapshotModel } from './participation-division-info-snapshot.model';

export class ApplicationModel {
  public id: IApplication['id'];
  public userId: IApplication['userId'];
  public competitionId: IApplication['competitionId'];
  public createdAt: IApplication['createdAt'];
  public updatedAt: IApplication['updatedAt'];
  public type: IApplication['type'];
  public status: IApplication['status'];
  public playerSnapshots: PlayerSnapshotModel[];
  public participationDivisionInfos: ParticipationDivisionInfoModel[];

  constructor(application: IApplication) {
    this.id = application.id;
    this.userId = application.userId;
    this.competitionId = application.competitionId;
    this.createdAt = application.createdAt;
    this.updatedAt = application.updatedAt;
    this.status = application.status;
    this.playerSnapshots = (application.playerSnapshots || []).map((snapshot) => new PlayerSnapshotModel(snapshot));
    this.participationDivisionInfos = (application.participationDivisionInfos || []).map(
      (info) => new ParticipationDivisionInfoModel(info),
    );
  }

  updateReadyApplication(
    newPlayerSnapshot: PlayerSnapshotModel,
    newParticipationDivisionInfos: ParticipationDivisionInfoModel[],
  ) {
    if (this.status !== 'READY') throw new Error('Only READY application can be updated');
    this.playerSnapshots = [newPlayerSnapshot];
    this.participationDivisionInfos = newParticipationDivisionInfos;
  }

  updateDoneApplication(
    newPlayerSnapshot: PlayerSnapshotModel,
    newParticipationDivisionInfoSnapshots: ParticipationDivisionInfoSnapshotModel[],
  ) {
    if (this.status !== 'DONE') throw new Error('Only DONE application can be updated');
    this.playerSnapshots.push(newPlayerSnapshot);
    this.participationDivisionInfos.forEach((participationDivisionInfo) => {
      const newParticipationDivisionInfoSnapshot = newParticipationDivisionInfoSnapshots.find(
        (newParticipationDivisionInfoSnapshot) =>
          newParticipationDivisionInfoSnapshot.participationDivisionInfoId === participationDivisionInfo.id,
      );
      if (!newParticipationDivisionInfoSnapshot) return;
      participationDivisionInfo.participationDivisionInfoSnapshots.push(newParticipationDivisionInfoSnapshot);
    });
  }
}
