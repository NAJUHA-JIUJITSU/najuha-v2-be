import { ICompetition } from '../../../domain/competition.interface';

interface SCompetition extends Omit<ICompetition, 'divisions' | 'combinationDiscountSnapshots'> {}

export interface FindCompetitionsResDto {
  competitions: SCompetition[];
}
