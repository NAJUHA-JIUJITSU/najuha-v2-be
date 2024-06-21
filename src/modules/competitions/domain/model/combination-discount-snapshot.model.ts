import { ICombinationDiscountSnapshot } from '../interface/combination-discount-snapshot.interface';

export class CombinationDiscountSnapshotModel {
  public readonly id: ICombinationDiscountSnapshot['id'];
  public readonly combinationDiscountRules: ICombinationDiscountSnapshot['combinationDiscountRules'];
  public readonly createdAt: ICombinationDiscountSnapshot['createdAt'];
  public readonly competitionId: ICombinationDiscountSnapshot['competitionId'];

  constructor(combinationDiscountSnapshot: ICombinationDiscountSnapshot) {
    this.id = combinationDiscountSnapshot.id;
    this.combinationDiscountRules = combinationDiscountSnapshot.combinationDiscountRules;
    this.createdAt = combinationDiscountSnapshot.createdAt;
    this.competitionId = combinationDiscountSnapshot.competitionId;
  }

  toData(): ICombinationDiscountSnapshot {
    return {
      id: this.id,
      combinationDiscountRules: this.combinationDiscountRules,
      createdAt: this.createdAt,
      competitionId: this.competitionId,
    };
  }
}
