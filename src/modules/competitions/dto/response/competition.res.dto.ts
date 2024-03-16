import { CompetitionEntity } from 'src/modules/competitions/domain/competition.entity';
import { DivisionEntity } from 'src/modules/competitions/domain/division.entity';
import { EarlyBirdDiscountStrategyEntity } from 'src/modules/competitions/domain/early-bird-discount-strategy.entity';

export interface CompetitionResDto extends Omit<CompetitionEntity, 'earlyBirdDiscountStrategy' | 'divisions'> {
  earlyBirdDiscountStrategy?: Omit<EarlyBirdDiscountStrategyEntity, 'competition'>;
  divisions?: Omit<DivisionEntity, 'competition'>[];
}
