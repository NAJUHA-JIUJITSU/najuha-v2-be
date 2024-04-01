import { ICombinationDiscountSnapshot } from '../../domain/structure/combination-discount-snapshot.interface';

export interface createCombinationDiscountSnapshotReqDto
  extends Pick<ICombinationDiscountSnapshot, 'combinationDiscountRules'> {}
