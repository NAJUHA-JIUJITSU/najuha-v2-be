import { IPriceSnapshot } from '../interface/price-snapshot.interface';

export class PriceSnapshotModel {
  public readonly id: IPriceSnapshot['id'];
  public readonly price: IPriceSnapshot['price'];
  public readonly createdAt: IPriceSnapshot['createdAt'];
  public readonly divisionId: IPriceSnapshot['divisionId'];

  constructor(entity: IPriceSnapshot) {
    this.id = entity.id;
    this.price = entity.price;
    this.createdAt = entity.createdAt;
    this.divisionId = entity.divisionId;
  }

  toEntity(): IPriceSnapshot {
    return {
      id: this.id,
      price: this.price,
      createdAt: this.createdAt,
      divisionId: this.divisionId,
    };
  }
}
