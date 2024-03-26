import { EarlybirdDiscountSnapshot } from 'src/modules/competitions/domain/entities/early-bird-discount-snapshot.entity';

export interface CreateEarlybirdDiscountSnapshotReqDto
  extends Pick<EarlybirdDiscountSnapshot, 'earlyBirdStartDate' | 'earlyBirdEndDate' | 'discountAmount'> {}
