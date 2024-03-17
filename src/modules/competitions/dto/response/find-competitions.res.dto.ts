import { Competition } from 'src/modules/competitions/domain/entities/competition.entity';
import { EarlyBirdDiscountStrategy } from 'src/modules/competitions/domain/entities/early-bird-discount-strategy.entity';

interface CompetitionResDto extends Omit<Competition, 'earlyBirdDiscountStrategy' | 'divisions'> {
  earlyBirdDiscountStrategy?: Omit<EarlyBirdDiscountStrategy, 'competition'>;
}

export type FindCompetitionsResDto = CompetitionResDto[];
