import { EarlybirdDiscountSnapshot } from '../../domain/entities/earlybird-discount-snapshot.entity';

export interface IEarlybirdDiscountSnapshot extends Omit<EarlybirdDiscountSnapshot, 'competition' | 'applications'> {}
