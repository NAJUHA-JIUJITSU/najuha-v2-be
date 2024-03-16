import { CompetitionEntity } from 'src/infrastructure/database/entities/competition.entity';
import { EarlyBirdDiscountStrategyEntity } from 'src/infrastructure/database/entities/early-bird-discount-strategy.entity';

interface CompetitionResDto extends Omit<CompetitionEntity, 'earlyBirdDiscountStrategy' | 'divisions'> {
  earlyBirdDiscountStrategy?: Omit<EarlyBirdDiscountStrategyEntity, 'competition'>;
}

export type FindCompetitionsResDto = CompetitionResDto[];
