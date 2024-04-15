import { IApplication } from '../interface/application.interface';
import { PlayerSnapshotEntity } from './player-snapshot.entity';
import { ParticipationDivisionInfoEntity } from './participation-division-info.entity';
import { ParticipationDivisionInfoSnapshotEntity } from './participation-division-info-snapshot.entity';

export class ApplicationEntity {
  public id: IApplication['id'];
  public userId: IApplication['userId'];
  public competitionId: IApplication['competitionId'];
  public createdAt: IApplication['createdAt'];
  public updatedAt: IApplication['updatedAt'];
  public status: IApplication['status'];
  public playerSnapshots: PlayerSnapshotEntity[];
  public participationDivisionInfos: ParticipationDivisionInfoEntity[];

  constructor(application: IApplication) {
    this.id = application.id;
    this.userId = application.userId;
    this.competitionId = application.competitionId;
    this.createdAt = application.createdAt;
    this.updatedAt = application.updatedAt;
    this.status = application.status;
    this.playerSnapshots = application.playerSnapshots.map(
      (playerSnapshot) => new PlayerSnapshotEntity(playerSnapshot),
    );
    this.participationDivisionInfos = application.participationDivisionInfos.map(
      (participationDivisionInfo) => new ParticipationDivisionInfoEntity(participationDivisionInfo),
    );
  }

  updateReadyApplication(
    newPlayerSnapshot: PlayerSnapshotEntity,
    newParticipationDivisionInfos: ParticipationDivisionInfoEntity[],
  ) {
    // TODO: 에러 표준화
    if (this.status !== 'READY') throw new Error('Only READY application can be updated');
    this.playerSnapshots = [newPlayerSnapshot];
    this.participationDivisionInfos = newParticipationDivisionInfos;
  }

  updateDoneApplication(
    newPlayerSnapshot: PlayerSnapshotEntity,
    newParticipationDivisionInfoSnapshots: ParticipationDivisionInfoSnapshotEntity[],
  ) {
    // TODO: 에러 표준화
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
