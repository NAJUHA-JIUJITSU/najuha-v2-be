import { IEarlybirdDiscountSnapshotModelData } from '../interface/earlybird-discount-snapshot.interface';

export class EarlybirdDiscountSnapshotModel {
  /** properties */
  private readonly _id: IEarlybirdDiscountSnapshotModelData['id'];
  private readonly _earlybirdStartDate: IEarlybirdDiscountSnapshotModelData['earlybirdStartDate'];
  private readonly _earlybirdEndDate: IEarlybirdDiscountSnapshotModelData['earlybirdEndDate'];
  private readonly _discountAmount: IEarlybirdDiscountSnapshotModelData['discountAmount'];
  private readonly _createdAt: IEarlybirdDiscountSnapshotModelData['createdAt'];
  private readonly _competitionId: IEarlybirdDiscountSnapshotModelData['competitionId'];

  constructor(data: IEarlybirdDiscountSnapshotModelData) {
    this._id = data.id;
    this._earlybirdStartDate = data.earlybirdStartDate;
    this._earlybirdEndDate = data.earlybirdEndDate;
    this._discountAmount = data.discountAmount;
    this._createdAt = data.createdAt;
    this._competitionId = data.competitionId;
  }

  toData(): IEarlybirdDiscountSnapshotModelData {
    return {
      id: this._id,
      earlybirdStartDate: this._earlybirdStartDate,
      earlybirdEndDate: this._earlybirdEndDate,
      discountAmount: this._discountAmount,
      createdAt: this._createdAt,
      competitionId: this._competitionId,
    };
  }

  get id() {
    return this._id;
  }

  get earlybirdStartDate(): Date {
    return new Date(this._earlybirdStartDate);
  }

  get earlybirdEndDate(): Date {
    return new Date(this._earlybirdEndDate);
  }

  get discountAmount(): number {
    return this._discountAmount;
  }

  get createdAt() {
    return this._createdAt;
  }

  get competitionId() {
    return this._competitionId;
  }
}
