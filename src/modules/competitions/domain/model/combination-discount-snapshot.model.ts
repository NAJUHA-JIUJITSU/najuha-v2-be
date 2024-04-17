import { ICombinationDiscountSnapshot } from '../interface/combination-discount-snapshot.interface';
import { ICompetition } from '../interface/competition.interface';

export class CombinationDiscountSnapshotModel {
  public readonly id: ICombinationDiscountSnapshot['id'];
  public readonly combinationDiscountRules: ICombinationDiscountSnapshot['combinationDiscountRules'];
  public readonly createdAt: ICombinationDiscountSnapshot['createdAt'];
  public readonly competitionId: ICompetition['id'];

  constructor(combinationDiscountSnapshot: ICombinationDiscountSnapshot) {
    this.id = combinationDiscountSnapshot.id;
    this.combinationDiscountRules = combinationDiscountSnapshot.combinationDiscountRules;
    this.createdAt = combinationDiscountSnapshot.createdAt;
    this.competitionId = combinationDiscountSnapshot.competitionId;
  }
}
