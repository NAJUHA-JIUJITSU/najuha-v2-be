import { IEarlybirdDiscountSnapshot } from '../../../domain/earlybird-discount-snapshot.interface';

export interface CreateEarlybirdDiscountSnapshotReqDto
  extends Pick<IEarlybirdDiscountSnapshot, 'earlybirdStartDate' | 'earlybirdEndDate' | 'discountAmount'> {}
