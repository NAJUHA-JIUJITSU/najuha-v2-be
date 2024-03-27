import { ICombinationDiscountSnapshot } from '../../interface/combination-discount-snapshot.interface';

export interface createCombinationDiscountSnapshotReqDto
  extends Pick<ICombinationDiscountSnapshot, 'combinationDiscountRules'> {}
