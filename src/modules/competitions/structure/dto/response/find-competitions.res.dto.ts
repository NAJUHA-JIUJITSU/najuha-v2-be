import { ICompetition } from '../../interface/competition.interface';
import { IEarlybirdDiscountSnapshot } from '../../interface/earlybird-discount-snapshot.interface';

interface SCompetition extends ICompetition {
  earlybirdDiscountSnapshots: IEarlybirdDiscountSnapshot[];
}

export interface FindCompetitionsResDto {
  competitions: SCompetition[];
}
