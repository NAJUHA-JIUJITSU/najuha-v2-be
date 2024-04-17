import { ICompetition } from '../interface/competition.interface';
import { IEarlybirdDiscountSnapshot } from '../interface/earlybird-discount-snapshot.interface';

export class EarlybirdDiscountSnapshotModel {
  public readonly id: IEarlybirdDiscountSnapshot['id'];
  public readonly earlybirdStartDate: IEarlybirdDiscountSnapshot['earlybirdStartDate'];
  public readonly earlybirdEndDate: IEarlybirdDiscountSnapshot['earlybirdEndDate'];
  public readonly discountAmount: IEarlybirdDiscountSnapshot['discountAmount'];
  public readonly createdAt: IEarlybirdDiscountSnapshot['createdAt'];
  public readonly competitionId: ICompetition['id'];

  constructor(earlybirdDiscountSnapshot: IEarlybirdDiscountSnapshot) {
    this.id = earlybirdDiscountSnapshot.id;
    this.earlybirdStartDate = earlybirdDiscountSnapshot.earlybirdStartDate;
    this.earlybirdEndDate = earlybirdDiscountSnapshot.earlybirdEndDate;
    this.discountAmount = earlybirdDiscountSnapshot.discountAmount;
    this.createdAt = earlybirdDiscountSnapshot.createdAt;
    this.competitionId = earlybirdDiscountSnapshot.competitionId;
  }
}
