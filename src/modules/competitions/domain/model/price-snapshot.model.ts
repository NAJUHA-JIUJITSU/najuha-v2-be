import { IPriceSnapshotModelData } from '../interface/price-snapshot.interface';

export class PriceSnapshotModel {
  /** properties */
  private readonly _id: IPriceSnapshotModelData['id'];
  private readonly _price: IPriceSnapshotModelData['price'];
  private readonly _createdAt: IPriceSnapshotModelData['createdAt'];
  private readonly _divisionId: IPriceSnapshotModelData['divisionId'];

  constructor(data: IPriceSnapshotModelData) {
    this._id = data.id;
    this._price = data.price;
    this._createdAt = data.createdAt;
    this._divisionId = data.divisionId;
  }

  toData(): IPriceSnapshotModelData {
    return {
      id: this._id,
      price: this._price,
      createdAt: this._createdAt,
      divisionId: this._divisionId,
    };
  }

  get id() {
    return this._id;
  }

  get price() {
    return this._price;
  }

  get createdAt() {
    return this._createdAt;
  }

  get divisionId() {
    return this._divisionId;
  }
}
