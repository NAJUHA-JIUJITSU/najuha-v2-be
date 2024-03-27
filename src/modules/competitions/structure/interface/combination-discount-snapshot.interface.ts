import { CombinationDiscountSnapshot } from '../../domain/entities/combination-discount-snapshot.entity';

export interface ICombinationDiscountSnapshot
  extends Omit<CombinationDiscountSnapshot, 'competition' | 'applications'> {}
