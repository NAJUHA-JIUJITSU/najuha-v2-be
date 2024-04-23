import { Application } from './application.model';
import { IApplication } from '../interface/application.interface';
import { assert } from 'typia';

export class ReadyApplication extends Application {
  constructor(entity: IApplication.Entity.Ready) {
    assert<IApplication.Entity.Ready>(entity);
    if (entity.status !== 'READY') throw new Error('Application status is not READY');
    super(entity);
  }

  toEntity(): IApplication.Entity.Ready {
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

  updateStatusToDeleted() {
    this.status = 'DELETED';
  }
}
