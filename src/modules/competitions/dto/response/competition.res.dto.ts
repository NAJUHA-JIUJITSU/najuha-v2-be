import { Competition } from 'src/modules/competitions/domain/competition.entity';
import { Division } from 'src/modules/competitions/domain/division.entity';
import { EarlyBirdDiscountStrategy } from 'src/modules/competitions/domain/early-bird-discount-strategy.entity';

export interface CompetitionResDto extends Omit<Competition, 'earlyBirdDiscountStrategy' | 'divisions'> {
  earlyBirdDiscountStrategy?: Omit<EarlyBirdDiscountStrategy, 'competition'>;
  divisions?: Omit<Division, 'competition'>[];
}
