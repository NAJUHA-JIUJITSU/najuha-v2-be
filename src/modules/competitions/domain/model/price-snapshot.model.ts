import { IDivision } from '../interface/division.interface';
import { IPriceSnapshot } from '../interface/price-snapshot.interface';

export class PriceSnapshotModel {
  public readonly id: IPriceSnapshot['id'];
  public readonly price: IPriceSnapshot['price'];
  public readonly createdAt: IPriceSnapshot['createdAt'];
  public readonly divisionId: IDivision['id'];

  constructor(priceSnapshot: IPriceSnapshot) {
    this.id = priceSnapshot.id;
    this.price = priceSnapshot.price;
    this.createdAt = priceSnapshot.createdAt;
    this.divisionId = priceSnapshot.divisionId;
  }
}
