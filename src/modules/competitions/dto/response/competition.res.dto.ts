import { Competition } from 'src/modules/competitions/domain/competition.entity';
import { Division } from 'src/modules/competitions/domain/division.entity';

export interface CompetitionResDto extends Omit<Competition, 'divisions'> {
  divisions?: Omit<Division, 'competition'>[];
}
