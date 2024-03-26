import { OmitOptional } from 'src/common/omit-optional.type';
import { CombinationDiscountSnapshot } from 'src/modules/competitions/domain/entities/combination-discount-snapshot.entity';

export interface CreateCombinationDiscountSnapshotResDto {
  combinationDiscountSnapshot: OmitOptional<CombinationDiscountSnapshot>;
}
