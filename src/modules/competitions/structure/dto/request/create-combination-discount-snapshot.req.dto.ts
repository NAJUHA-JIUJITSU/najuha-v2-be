import { ICombinationDiscountSnapshot } from '../../../domain/combination-discount-snapshot.interface';

export interface createCombinationDiscountSnapshotReqDto
  extends Pick<ICombinationDiscountSnapshot, 'combinationDiscountRules'> {}
