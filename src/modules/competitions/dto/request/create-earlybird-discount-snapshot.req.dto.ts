import { IEarlybirdDiscountSnapshot } from '../../domain/structure/earlybird-discount-snapshot.interface';

export interface CreateEarlybirdDiscountSnapshotReqDto
  extends Pick<IEarlybirdDiscountSnapshot, 'earlybirdStartDate' | 'earlybirdEndDate' | 'discountAmount'> {}
