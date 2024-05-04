import { ApplicationModel } from './application.model';
import { IApplication } from '../interface/application.interface';

export class ReadyApplicationModel extends ApplicationModel {
  constructor(entity: IApplication) {
    if (entity.status !== 'READY') throw new Error('Application status is not READY');
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
      additionalInfos: this.additionaInfos.map((info) => info.toEntity()),
    };
  }

  updateStatusToDeleted() {
    this.status = 'DELETED';
  }

  getParticipationDivisionIds() {
    return this.participationDivisionInfos.map(
      (info) => info.participationDivisionInfoSnapshots[info.participationDivisionInfoSnapshots.length - 1].division.id,
    );
  }
}
