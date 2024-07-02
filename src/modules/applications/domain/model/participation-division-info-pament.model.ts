import { DivisionModel } from '../../../competitions/domain/model/division.model';
import { PriceSnapshotModel } from '../../../competitions/domain/model/price-snapshot.model';
import { IParticipationDivisionInfoPaymentModelData } from '../interface/participation-division-info-payment.interface';
import { ParticipationDivisionInfoModel } from './participation-division-info.model';

export class ParticipationDivisionInfoPaymentModel {
  private readonly id: IParticipationDivisionInfoPaymentModelData['id'];
  private readonly createdAt: IParticipationDivisionInfoPaymentModelData['createdAt'];
  private readonly applicationOrderPaymentSnapshotId: IParticipationDivisionInfoPaymentModelData['applicationOrderPaymentSnapshotId'];
  private readonly participationDivisionInfoId: IParticipationDivisionInfoPaymentModelData['participationDivisionInfoId'];
  private readonly divisionId: IParticipationDivisionInfoPaymentModelData['divisionId'];
  private readonly priceSnapshotId: IParticipationDivisionInfoPaymentModelData['priceSnapshotId'];
  private readonly participationDivisionInfo: ParticipationDivisionInfoModel;
  private readonly division: DivisionModel;
  private readonly priceSnapshot: PriceSnapshotModel;

  constructor(data: IParticipationDivisionInfoPaymentModelData) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.applicationOrderPaymentSnapshotId = data.applicationOrderPaymentSnapshotId;
    this.participationDivisionInfoId = data.participationDivisionInfoId;
    this.divisionId = data.divisionId;
    this.priceSnapshotId = data.priceSnapshotId;
    this.participationDivisionInfo = new ParticipationDivisionInfoModel(data.participationDivisionInfo);
    this.division = new DivisionModel(data.division);
    this.priceSnapshot = new PriceSnapshotModel(data.priceSnapshot);
  }

  toData(): IParticipationDivisionInfoPaymentModelData {
    return {
      id: this.id,
      createdAt: this.createdAt,
      applicationOrderPaymentSnapshotId: this.applicationOrderPaymentSnapshotId,
      participationDivisionInfoId: this.participationDivisionInfoId,
      divisionId: this.divisionId,
      priceSnapshotId: this.priceSnapshotId,
      participationDivisionInfo: this.participationDivisionInfo.toData(),
      division: this.division.toData(),
      priceSnapshot: this.priceSnapshot.toData(),
    };
  }
}
