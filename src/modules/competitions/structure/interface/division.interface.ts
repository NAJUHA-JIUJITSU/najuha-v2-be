import { Division } from '../../domain/entities/division.entity';

export interface IDivision extends Omit<Division, 'competition' | 'priceSnapshots' | 'participationDivisions'> {}
