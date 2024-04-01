import { ICombinationDiscountSnapshot } from '../../interface/combination-discount-snapshot.interface';
import { ICompetition } from '../../interface/competition.interface';
import { IDivision } from '../../interface/division.interface';
import { IEarlybirdDiscountSnapshot } from '../../interface/earlybird-discount-snapshot.interface';
import { IPriceSnapshot } from '../../interface/price-snapshot.interface';

interface SDivision extends IDivision {
  priceSnapshots: IPriceSnapshot[];
}

interface SCompetition extends ICompetition {
  divisions: SDivision[];
  earlybirdDiscountSnapshots: IEarlybirdDiscountSnapshot[];
  combinationDiscountSnapshots: ICombinationDiscountSnapshot[];
}

export interface CompetitionResDto {
  competition: SCompetition;
}
