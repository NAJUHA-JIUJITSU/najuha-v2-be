import { Application } from './application.model';
import { IApplication } from '../interface/application.interface';
import { PlayerSnapshot } from './player-snapshot.model';
import { IParticipationDivisionInfo } from '../interface/participation-division-info.interface';
import { ParticipationDivisionInfoSnapshot } from './participation-division-info-snapshot.model';
import { assert } from 'typia';

export class DoneApplication extends Application {
  constructor(value: IApplication.ModelValue.Done) {
    assert<IApplication.ModelValue.Done>(value);
    if (value.status !== 'DONE') throw new Error('Application status is not DONE');
    super(value);
  }

  toModelValue(): IApplication.ModelValue.Done {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      type: this.type,
      status: this.status,
      competitionId: this.competitionId,
      userId: this.userId,
      playerSnapshots: this.playerSnapshots.map((snapshot) => snapshot.toModelValue()),
      participationDivisionInfos: this.participationDivisionInfos.map((info) => info.toModelValue()),
    };
  }

  addPlayerSnapshot(newPlayerSnapshot: PlayerSnapshot) {
    this.playerSnapshots.push(newPlayerSnapshot);
  }

  updateParticipationDivisionInfo(
    participationDivisionInfoId: IParticipationDivisionInfo['id'],
    newParticipationDivisionInfoSnapshot: ParticipationDivisionInfoSnapshot,
  ) {
    const participationDivisionInfo = this.participationDivisionInfos.find(
      (info) => info.getId() === participationDivisionInfoId,
    );
    if (!participationDivisionInfo) throw new Error('Participation division info not found');
    participationDivisionInfo.addParticipationDivisionInfoSnapshot(newParticipationDivisionInfoSnapshot);
  }
}
