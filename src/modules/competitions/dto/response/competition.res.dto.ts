import { CompetitionEntity } from 'src/infrastructure/database/entities/competition/competition.entity';
import { DivisionEntity } from 'src/infrastructure/database/entities/competition/division.entity';
import { EarlybirdDiscountSnapshotEntity } from 'src/infrastructure/database/entities/competition/early-bird-discount-snapshot.entity';
import { PriceSnapshotEntity } from 'src/infrastructure/database/entities/competition/price-snapshot.entity';

interface SimplifiedDivision extends Omit<DivisionEntity, 'competition' | 'priceSnapshots'> {
  priceSnapshots?: SimplifiedPriceSnapshot[];
}

interface SimplifiedPriceSnapshot extends Omit<PriceSnapshotEntity, 'division'> {}

interface SimplifiedEarlybirdDiscountSnapshot extends Omit<EarlybirdDiscountSnapshotEntity, 'competition'> {}

export interface CompetitionResDto extends Omit<CompetitionEntity, 'divisions' | 'earlybirdDiscountSnapshots'> {
  divisions?: SimplifiedDivision[];
  earlybirdDiscountSnapshots?: SimplifiedEarlybirdDiscountSnapshot[];
}
