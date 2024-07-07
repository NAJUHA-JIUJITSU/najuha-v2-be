import { ICombinationDiscountSnapshotModelData } from '../interface/combination-discount-snapshot.interface';

export class CombinationDiscountSnapshotModel {
  /** properties */
  private readonly _id: ICombinationDiscountSnapshotModelData['id'];
  private readonly _combinationDiscountRules: ICombinationDiscountSnapshotModelData['combinationDiscountRules'];
  private readonly _createdAt: ICombinationDiscountSnapshotModelData['createdAt'];
  private readonly _competitionId: ICombinationDiscountSnapshotModelData['competitionId'];

  constructor(combinationDiscountSnapshot: ICombinationDiscountSnapshotModelData) {
    this._id = combinationDiscountSnapshot.id;
    this._combinationDiscountRules = combinationDiscountSnapshot.combinationDiscountRules;
    this._createdAt = combinationDiscountSnapshot.createdAt;
    this._competitionId = combinationDiscountSnapshot.competitionId;
  }

  toData(): ICombinationDiscountSnapshotModelData {
    return {
      id: this._id,
      combinationDiscountRules: this._combinationDiscountRules,
      createdAt: this._createdAt,
      competitionId: this._competitionId,
    };
  }

  get id() {
    return this._id;
  }

  get combinationDiscountRules() {
    return this._combinationDiscountRules;
  }

  get createdAt() {
    return this._createdAt;
  }

  get competitionId() {
    return this._competitionId;
  }
}
