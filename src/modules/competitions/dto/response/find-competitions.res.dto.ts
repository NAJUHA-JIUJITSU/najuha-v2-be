import { CompetitionEntity } from 'src/infrastructure/database/entities/competition/competition.entity';
import { EarlybirdDiscountSnapshotEntity } from 'src/infrastructure/database/entities/competition/early-bird-discount-snapshot.entity';

interface CompetitionResDto extends Omit<CompetitionEntity, 'earlyBirdDiscountStrategy' | 'divisions'> {
  earlyBirdDiscountStrategy?: Omit<EarlybirdDiscountSnapshotEntity, 'competition'>;
}

export type FindCompetitionsResDto = CompetitionResDto[];
