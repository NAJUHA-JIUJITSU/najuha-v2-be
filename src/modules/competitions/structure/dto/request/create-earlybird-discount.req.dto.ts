import { EarlybirdDiscountSnapshot } from 'src/modules/competitions/domain/entities/early-bird-discount-snapshot.entity';

export interface CreateEarlybirdDiscountReqDto
  extends Pick<EarlybirdDiscountSnapshot, 'earlyBirdStartDate' | 'earlyBirdEndDate' | 'discountAmount'> {}
