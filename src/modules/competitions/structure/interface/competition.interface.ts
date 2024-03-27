import { Competition } from '../../domain/entities/competition.entity';

export interface ICompetition
  extends Omit<
    Competition,
    'earlybirdDiscountSnapshots' | 'combinationDiscountSnapshots' | 'divisions' | 'applications'
  > {}
