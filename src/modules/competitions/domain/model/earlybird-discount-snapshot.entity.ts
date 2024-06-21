import { IEarlybirdDiscountSnapshot } from '../interface/earlybird-discount-snapshot.interface';

export class EarlybirdDiscountSnapshotModel {
  public readonly id: IEarlybirdDiscountSnapshot['id'];
  public readonly earlybirdStartDate: IEarlybirdDiscountSnapshot['earlybirdStartDate'];
  public readonly earlybirdEndDate: IEarlybirdDiscountSnapshot['earlybirdEndDate'];
  public readonly discountAmount: IEarlybirdDiscountSnapshot['discountAmount'];
  public readonly createdAt: IEarlybirdDiscountSnapshot['createdAt'];
  public readonly competitionId: IEarlybirdDiscountSnapshot['competitionId'];

  constructor(entity: IEarlybirdDiscountSnapshot) {
    this.id = entity.id;
    this.earlybirdStartDate = entity.earlybirdStartDate;
    this.earlybirdEndDate = entity.earlybirdEndDate;
    this.discountAmount = entity.discountAmount;
    this.createdAt = entity.createdAt;
    this.competitionId = entity.competitionId;
  }

  toData(): IEarlybirdDiscountSnapshot {
    return {
      id: this.id,
      earlybirdStartDate: this.earlybirdStartDate,
      earlybirdEndDate: this.earlybirdEndDate,
      discountAmount: this.discountAmount,
      createdAt: this.createdAt,
      competitionId: this.competitionId,
    };
  }
}
