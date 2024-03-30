import { ICompetition } from 'src/modules/competitions/domain/competition.interface';
import { IDivision } from '../../../domain/division.interface';
import { IPriceSnapshot } from '../../../domain/price-snapshot.interface';

interface SDivision extends IDivision {
  priceSnapshots: IPriceSnapshot[];
}

// interface SCompetition {
//   divisions: SDivision[];
//   earlybirdDiscountSnapshots: IEarlybirdDiscountSnapshot[];
//   combinationDiscountSnapshots: ICombinationDiscountSnapshot[];
// }

export interface CompetitionResDto {
  competition: ICompetition;
}
