import { ICombinationDiscountSnapshotModelData } from '../interface/combination-discount-snapshot.interface';

export class CombinationDiscountSnapshotModel {
  public readonly id: ICombinationDiscountSnapshotModelData['id'];
  public readonly combinationDiscountRules: ICombinationDiscountSnapshotModelData['combinationDiscountRules'];
  public readonly createdAt: ICombinationDiscountSnapshotModelData['createdAt'];
  public readonly competitionId: ICombinationDiscountSnapshotModelData['competitionId'];

  constructor(combinationDiscountSnapshot: ICombinationDiscountSnapshotModelData) {
    this.id = combinationDiscountSnapshot.id;
    this.combinationDiscountRules = combinationDiscountSnapshot.combinationDiscountRules;
    this.createdAt = combinationDiscountSnapshot.createdAt;
    this.competitionId = combinationDiscountSnapshot.competitionId;
  }

  toData(): ICombinationDiscountSnapshotModelData {
    return {
      id: this.id,
      combinationDiscountRules: this.combinationDiscountRules,
      createdAt: this.createdAt,
      competitionId: this.competitionId,
    };
  }

  getId() {
    return this.id;
  }
}
