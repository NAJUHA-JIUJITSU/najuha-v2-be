import { ApplicationModel } from './application.model';
import { IApplication } from '../interface/application.interface';
import { PlayerSnapshot } from './player-snapshot.model';
import { IParticipationDivisionInfo } from '../interface/participation-division-info.interface';
import { ParticipationDivisionInfoSnapshot } from './participation-division-info-snapshot.model';

export class DoneApplication extends ApplicationModel {
  constructor(entity: IApplication) {
    if (entity.status !== 'DONE') throw new Error('Application status is not DONE');
    super(entity);
  }

  toEntity(): IApplication {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      type: this.type,
      status: this.status,
      competitionId: this.competitionId,
      userId: this.userId,
      playerSnapshots: this.playerSnapshots.map((snapshot) => snapshot.toEntity()),
      participationDivisionInfos: this.participationDivisionInfos.map((info) => info.toEntity()),
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
