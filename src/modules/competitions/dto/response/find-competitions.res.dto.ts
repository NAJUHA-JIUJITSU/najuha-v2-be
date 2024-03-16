import { CompetitionEntity } from 'src/modules/competitions/domain/competition.entity';
import { EarlyBirdDiscountStrategyEntity } from 'src/modules/competitions/domain/early-bird-discount-strategy.entity';

interface CompetitionResDto extends Omit<CompetitionEntity, 'earlyBirdDiscountStrategy' | 'divisions'> {
  earlyBirdDiscountStrategy?: Omit<EarlyBirdDiscountStrategyEntity, 'competition'>;
}

export type FindCompetitionsResDto = CompetitionResDto[];
