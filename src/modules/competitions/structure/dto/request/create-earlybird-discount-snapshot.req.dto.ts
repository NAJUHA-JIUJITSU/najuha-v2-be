import { IEarlybirdDiscountSnapshot } from '../../interface/earlybird-discount-snapshot.interface';

export interface CreateEarlybirdDiscountSnapshotReqDto
  extends Pick<IEarlybirdDiscountSnapshot, 'earlyBirdStartDate' | 'earlyBirdEndDate' | 'discountAmount'> {}
