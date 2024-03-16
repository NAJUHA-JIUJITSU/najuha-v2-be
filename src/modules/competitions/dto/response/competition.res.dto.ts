import { CompetitionEntity } from 'src/infrastructure/database/entities/competition.entity';
import { EarlyBirdDiscountStrategyEntity } from 'src/infrastructure/database/entities/early-bird-discount-strategy.entity';

export interface CompetitionResDto extends Omit<CompetitionEntity, 'earlyBirdDiscountStrategy'> {
  earlyBirdDiscountStrategy?: Omit<EarlyBirdDiscountStrategyEntity, 'competition'>;
}
