import { IEarlybirdDiscountSnapshotModelData } from '../interface/earlybird-discount-snapshot.interface';

export class EarlybirdDiscountSnapshotModel {
  private readonly id: IEarlybirdDiscountSnapshotModelData['id'];
  private readonly earlybirdStartDate: IEarlybirdDiscountSnapshotModelData['earlybirdStartDate'];
  private readonly earlybirdEndDate: IEarlybirdDiscountSnapshotModelData['earlybirdEndDate'];
  private readonly discountAmount: IEarlybirdDiscountSnapshotModelData['discountAmount'];
  private readonly createdAt: IEarlybirdDiscountSnapshotModelData['createdAt'];
  private readonly competitionId: IEarlybirdDiscountSnapshotModelData['competitionId'];

  constructor(data: IEarlybirdDiscountSnapshotModelData) {
    this.id = data.id;
    this.earlybirdStartDate = data.earlybirdStartDate;
    this.earlybirdEndDate = data.earlybirdEndDate;
    this.discountAmount = data.discountAmount;
    this.createdAt = data.createdAt;
    this.competitionId = data.competitionId;
  }

  toData(): IEarlybirdDiscountSnapshotModelData {
    return {
      id: this.id,
      earlybirdStartDate: this.earlybirdStartDate,
      earlybirdEndDate: this.earlybirdEndDate,
      discountAmount: this.discountAmount,
      createdAt: this.createdAt,
      competitionId: this.competitionId,
    };
  }

  getId() {
    return this.id;
  }

  getEarlybirdStartDate(): Date {
    return new Date(this.earlybirdStartDate);
  }

  getEarlybirdEndDate(): Date {
    return new Date(this.earlybirdEndDate);
  }

  getDiscountAmount(): number {
    return this.discountAmount;
  }
}
