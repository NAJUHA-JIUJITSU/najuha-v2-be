import { ICompetition } from '../../competition.interface';
import { IDivision } from '../../division.interface';

export interface CompetitionResDto extends Omit<ICompetition, 'divisions'> {
  divisions?: Omit<IDivision, 'competition'>[];
}
