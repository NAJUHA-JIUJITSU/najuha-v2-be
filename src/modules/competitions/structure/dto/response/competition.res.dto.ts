import { OmitOptional } from 'src/common/omit-optional.type';
import { CombinationDiscountSnapshot } from 'src/infrastructure/database/entities/competition/combination-discount-snapshot.entity';
import { Competition } from 'src/infrastructure/database/entities/competition/competition.entity';
import { Division } from 'src/infrastructure/database/entities/competition/division.entity';
import { EarlybirdDiscountSnapshot } from 'src/infrastructure/database/entities/competition/early-bird-discount-snapshot.entity';
import { PriceSnapshot } from 'src/infrastructure/database/entities/competition/price-snapshot.entity';

interface SDivision extends OmitOptional<Division> {
  priceSnapshots?: OmitOptional<PriceSnapshot>[];
}

export interface CompetitionResDto extends OmitOptional<Competition> {
  divisions?: SDivision[];
  earlybirdDiscountSnapshots?: OmitOptional<EarlybirdDiscountSnapshot>[];
  combinationDiscountSnapshots?: OmitOptional<CombinationDiscountSnapshot>[];
}
