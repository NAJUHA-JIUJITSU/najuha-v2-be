import { OmitOptional } from 'src/common/omit-optional.type';
import { Competition } from 'src/modules/competitions/domain/entities/competition.entity';
import { EarlybirdDiscountSnapshot } from 'src/modules/competitions/domain/entities/early-bird-discount-snapshot.entity';

export interface SCompetition extends Omit<OmitOptional<Competition>, 'description'> {
  earlybirdDiscountSnapshots?: OmitOptional<EarlybirdDiscountSnapshot>[];
}

export type FindCompetitionsResDto = SCompetition[];
