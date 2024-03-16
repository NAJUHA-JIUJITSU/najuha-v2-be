import { CompetitionEntity } from 'src/infrastructure/database/entities/competition.entity';
import { DivisionEntity } from 'src/infrastructure/database/entities/division.entity';
import { EarlyBirdDiscountStrategyEntity } from 'src/infrastructure/database/entities/early-bird-discount-strategy.entity';

export interface CompetitionResDto extends Omit<CompetitionEntity, 'earlyBirdDiscountStrategy' | 'divisions'> {
  earlyBirdDiscountStrategy?: Omit<EarlyBirdDiscountStrategyEntity, 'competition'>;
  divisions?: Omit<DivisionEntity, 'competition'>[];
}
