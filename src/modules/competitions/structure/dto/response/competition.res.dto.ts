import { OmitOptional } from 'src/common/omit-optional.type';
import { CombinationDiscountSnapshot } from 'src/modules/competitions/domain/entities/combination-discount-snapshot.entity';
import { Competition } from 'src/modules/competitions/domain/entities/competition.entity';
import { Division } from 'src/modules/competitions/domain/entities/division.entity';
import { EarlybirdDiscountSnapshot } from 'src/modules/competitions/domain/entities/early-bird-discount-snapshot.entity';
import { PriceSnapshot } from 'src/modules/competitions/domain/entities/price-snapshot.entity';

interface SDivision extends OmitOptional<Division> {
  priceSnapshots?: OmitOptional<PriceSnapshot>[];
}

export interface CompetitionResDto extends OmitOptional<Competition> {
  divisions?: SDivision[];
  earlybirdDiscountSnapshots?: OmitOptional<EarlybirdDiscountSnapshot>[];
  combinationDiscountSnapshots?: OmitOptional<CombinationDiscountSnapshot>[];
}
