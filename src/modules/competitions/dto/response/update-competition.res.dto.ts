import { ICompetition } from '../../domain/structure/competition.interface';

export interface UpdateCompetitionResDto {
  competition: Omit<ICompetition, 'divisions' | 'earlybirdDiscountSnapshots' | 'combinationDiscountSnapshots'>;
}
