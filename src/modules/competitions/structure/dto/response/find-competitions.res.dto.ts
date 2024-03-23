import { OmitOptional } from 'src/common/omit-optional.type';
import { CompetitionEntity } from 'src/infrastructure/database/entities/competition/competition.entity';
import { EarlybirdDiscountSnapshotEntity } from 'src/infrastructure/database/entities/competition/early-bird-discount-snapshot.entity';

export interface SCompetition extends Omit<OmitOptional<CompetitionEntity>, 'description'> {
  earlybirdDiscountSnapshots?: OmitOptional<EarlybirdDiscountSnapshotEntity>[];
}

export type FindCompetitionsResDto = SCompetition[];
