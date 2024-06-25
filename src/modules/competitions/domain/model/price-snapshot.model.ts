import { IPriceSnapshotModelData } from '../interface/price-snapshot.interface';

export class PriceSnapshotModel {
  private readonly id: IPriceSnapshotModelData['id'];
  private readonly price: IPriceSnapshotModelData['price'];
  private readonly createdAt: IPriceSnapshotModelData['createdAt'];
  private readonly divisionId: IPriceSnapshotModelData['divisionId'];

  constructor(data: IPriceSnapshotModelData) {
    this.id = data.id;
    this.price = data.price;
    this.createdAt = data.createdAt;
    this.divisionId = data.divisionId;
  }

  toData(): IPriceSnapshotModelData {
    return {
      id: this.id,
      price: this.price,
      createdAt: this.createdAt,
      divisionId: this.divisionId,
    };
  }

  getPrice() {
    return this.price;
  }
}
