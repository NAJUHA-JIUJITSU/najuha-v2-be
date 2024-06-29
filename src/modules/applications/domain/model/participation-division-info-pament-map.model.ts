import { IParticipationDivisionInfoPaymentMapModelData } from '../interface/participation-division-info-payment-map.interface';

export class ParticipationDivisionInfoPaymentMapModel {
  private readonly id: IParticipationDivisionInfoPaymentMapModelData['id'];
  private readonly createdAt: IParticipationDivisionInfoPaymentMapModelData['createdAt'];
  private readonly applicationPaymentSnapshotId: IParticipationDivisionInfoPaymentMapModelData['applicationPaymentSnapshotId'];
  private readonly participationDivisionInfoId: IParticipationDivisionInfoPaymentMapModelData['participationDivisionInfoId'];

  constructor(data: IParticipationDivisionInfoPaymentMapModelData) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.applicationPaymentSnapshotId = data.applicationPaymentSnapshotId;
    this.participationDivisionInfoId = data.participationDivisionInfoId;
  }

  toData(): IParticipationDivisionInfoPaymentMapModelData {
    return {
      id: this.id,
      createdAt: this.createdAt,
      applicationPaymentSnapshotId: this.applicationPaymentSnapshotId,
      participationDivisionInfoId: this.participationDivisionInfoId,
    };
  }
}
