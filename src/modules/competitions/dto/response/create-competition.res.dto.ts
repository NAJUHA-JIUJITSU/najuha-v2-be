import { ICompetition } from '../../domain/structure/competition.interface';

export interface CreateCompetitionResDto {
  competition: Omit<ICompetition, 'divisions' | 'earlybirdDiscountSnapshots' | 'combinationDiscountSnapshots'>;
}
