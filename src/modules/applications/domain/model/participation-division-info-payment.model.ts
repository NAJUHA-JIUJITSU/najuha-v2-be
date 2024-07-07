import { DivisionModel } from '../../../competitions/domain/model/division.model';
import { PriceSnapshotModel } from '../../../competitions/domain/model/price-snapshot.model';
import { IParticipationDivisionInfoPaymentModelData } from '../interface/participation-division-info-payment.interface';
import { ParticipationDivisionInfoModel } from './participation-division-info.model';

export class ParticipationDivisionInfoPaymentModel {
  /** properties */
  private readonly _id: IParticipationDivisionInfoPaymentModelData['id'];
  private readonly _createdAt: IParticipationDivisionInfoPaymentModelData['createdAt'];
  private readonly _applicationOrderPaymentSnapshotId: IParticipationDivisionInfoPaymentModelData['applicationOrderPaymentSnapshotId'];
  private readonly _participationDivisionInfoId: IParticipationDivisionInfoPaymentModelData['participationDivisionInfoId'];
  private readonly _divisionId: IParticipationDivisionInfoPaymentModelData['divisionId'];
  private readonly _priceSnapshotId: IParticipationDivisionInfoPaymentModelData['priceSnapshotId'];
  private _status: IParticipationDivisionInfoPaymentModelData['status'];
  /** relations */
  private readonly _participationDivisionInfo: ParticipationDivisionInfoModel;
  private readonly _division: DivisionModel;
  private readonly _priceSnapshot: PriceSnapshotModel;

  constructor(data: IParticipationDivisionInfoPaymentModelData) {
    this._id = data.id;
    this._createdAt = data.createdAt;
    this._status = data.status;
    this._applicationOrderPaymentSnapshotId = data.applicationOrderPaymentSnapshotId;
    this._participationDivisionInfoId = data.participationDivisionInfoId;
    this._divisionId = data.divisionId;
    this._priceSnapshotId = data.priceSnapshotId;
    this._participationDivisionInfo = new ParticipationDivisionInfoModel(data.participationDivisionInfo);
    this._division = new DivisionModel(data.division);
    this._priceSnapshot = new PriceSnapshotModel(data.priceSnapshot);
  }

  toData(): IParticipationDivisionInfoPaymentModelData {
    return {
      id: this._id,
      createdAt: this._createdAt,
      status: this._status,
      applicationOrderPaymentSnapshotId: this._applicationOrderPaymentSnapshotId,
      participationDivisionInfoId: this._participationDivisionInfoId,
      divisionId: this._divisionId,
      priceSnapshotId: this._priceSnapshotId,
      participationDivisionInfo: this._participationDivisionInfo.toData(),
      division: this._division.toData(),
      priceSnapshot: this._priceSnapshot.toData(),
    };
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  get status() {
    return this._status;
  }

  get applicationOrderPaymentSnapshotId() {
    return this._applicationOrderPaymentSnapshotId;
  }

  get participationDivisionInfoId() {
    return this._participationDivisionInfoId;
  }

  get divisionId() {
    return this._divisionId;
  }

  get priceSnapshotId() {
    return this._priceSnapshotId;
  }

  get participationDivisionInfo() {
    return this._participationDivisionInfo;
  }

  get division() {
    return this._division;
  }

  get priceSnapshot() {
    return this._priceSnapshot;
  }

  cancel() {
    this._status = 'CANCELED';
  }

  approve() {
    this._status = 'DONE';
  }
}
