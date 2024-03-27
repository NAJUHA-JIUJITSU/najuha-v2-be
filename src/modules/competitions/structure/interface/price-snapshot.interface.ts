import { PriceSnapshot } from '../../domain/entities/price-snapshot.entity';

export interface IPriceSnapshot extends Omit<PriceSnapshot, 'division' | 'participationDivisions'> {}
