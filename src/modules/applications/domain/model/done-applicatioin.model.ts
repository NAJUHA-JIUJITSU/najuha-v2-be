import { ApplicationModel } from './application.model';
import { IApplication } from '../interface/application.interface';
import { PlayerSnapshotModel } from './player-snapshot.model';
import { ParticipationDivisionInfoSnapshotModel } from './participation-division-info-snapshot.model';
import { ApplicationsErrors, BusinessException } from 'src/common/response/errorResponse';
import { IAdditionalInfoUpdateDto } from '../interface/additional-info.interface';

export class DoneApplicationModel extends ApplicationModel {
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
      additionalInfos: this.additionaInfos.map((info) => info.toEntity()),
    };
  }

  addPlayerSnapshot(newPlayerSnapshot: PlayerSnapshotModel) {
    this.playerSnapshots.push(newPlayerSnapshot);
  }

  addParticipationDivisionInfoSnapshots(
    newParticipationDivisionInfoSnapshots: ParticipationDivisionInfoSnapshotModel[],
  ) {
    newParticipationDivisionInfoSnapshots.forEach((snapshot) => {
      const participationDivisionInfo = this.participationDivisionInfos.find(
        (info) => info.getId() === snapshot.participationDivisionInfoId,
      );
      if (!participationDivisionInfo)
        throw new BusinessException(ApplicationsErrors.APPLICATIONS_PARTICIPATION_DIVISION_INFO_NOT_FOUND);
      participationDivisionInfo.addParticipationDivisionInfoSnapshot(snapshot);
    });
  }

  updateAdditionalInfos(additionalInfoUpdateDtos: IAdditionalInfoUpdateDto[]) {
    additionalInfoUpdateDtos.forEach((updateDto) => {
      const additionalInfo = this.additionaInfos.find((info) => info.getType() === updateDto.type);
      if (!additionalInfo) throw new BusinessException(ApplicationsErrors.APPLICATIONS_ADDITIONAL_INFO_NOT_FOUND);
      additionalInfo.updateValue(updateDto.value);
    });
  }
}
