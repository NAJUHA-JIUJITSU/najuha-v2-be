import { OmitOptional } from 'src/common/omit-optional.type';
import { Competition } from 'src/infrastructure/database/entities/competition/competition.entity';
import { EarlybirdDiscountSnapshot } from 'src/infrastructure/database/entities/competition/early-bird-discount-snapshot.entity';

export interface SCompetition extends Omit<OmitOptional<Competition>, 'description'> {
  earlybirdDiscountSnapshots?: OmitOptional<EarlybirdDiscountSnapshot>[];
}

export type FindCompetitionsResDto = SCompetition[];
