import { Competition } from 'src/modules/competitions/domain/entities/competition.entity';
import { Division } from 'src/modules/competitions/domain/entities/division.entity';

export interface CompetitionResDto extends Omit<Competition, 'divisions'> {
  divisions?: Omit<Division, 'competition'>[];
}
