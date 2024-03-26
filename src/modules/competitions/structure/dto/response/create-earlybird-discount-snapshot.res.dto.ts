import { OmitOptional } from 'src/common/omit-optional.type';
import { EarlybirdDiscountSnapshot } from 'src/modules/competitions/domain/entities/early-bird-discount-snapshot.entity';

export interface CreateEarlybirdDiscountSnapshotResDto {
  earlybirdDiscountSnapshot: OmitOptional<EarlybirdDiscountSnapshot>;
}
