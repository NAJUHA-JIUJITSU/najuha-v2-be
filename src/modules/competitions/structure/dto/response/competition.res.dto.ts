import { OmitOptional } from 'src/common/omit-optional.type';
import { combinationDiscountSnapshotEntity } from 'src/infrastructure/database/entities/competition/combination-discount-snapshot.entity';
import { CompetitionEntity } from 'src/infrastructure/database/entities/competition/competition.entity';
import { DivisionEntity } from 'src/infrastructure/database/entities/competition/division.entity';
import { EarlybirdDiscountSnapshotEntity } from 'src/infrastructure/database/entities/competition/early-bird-discount-snapshot.entity';
import { PriceSnapshotEntity } from 'src/infrastructure/database/entities/competition/price-snapshot.entity';

interface SDivision extends OmitOptional<DivisionEntity> {
  priceSnapshots?: OmitOptional<PriceSnapshotEntity>[];
}

export interface CompetitionResDto extends OmitOptional<CompetitionEntity> {
  divisions?: SDivision[];
  earlybirdDiscountSnapshots?: OmitOptional<EarlybirdDiscountSnapshotEntity>[];
  combinationDiscountSnapshots?: OmitOptional<combinationDiscountSnapshotEntity>[];
}
