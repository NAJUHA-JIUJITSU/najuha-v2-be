import { ICompetition } from '../../domain/structure/competition.interface';

export interface FindCompetitionsResDto {
  competitions: Array<Omit<ICompetition, 'divisions' | 'combinationDiscountSnapshots'>>;
}
