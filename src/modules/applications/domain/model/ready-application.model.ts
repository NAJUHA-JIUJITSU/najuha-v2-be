import { Application } from './application.model';
import { IApplication } from '../interface/application.interface';
import { assert } from 'typia';

export class ReadyApplication extends Application {
  constructor(value: IApplication.ModelValue.Ready) {
    assert<IApplication.ModelValue.Ready>(value);
    if (value.status !== 'READY') throw new Error('Application status is not READY');
    super(value);
  }

  toModelValue(): IApplication.ModelValue.Ready {
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

  updateStatusToDeleted() {
    this.status = 'DELETED';
  }
}
