import { TId, TDateOrStringDate } from '../../../../common/common-types';
import { IDivision } from '../../../competitions/domain/interface/division.interface';
import { IPriceSnapshot } from '../../../competitions/domain/interface/price-snapshot.interface';
import { tags } from 'typia';

export interface IParticipationDivisionInfoPayment {
  /** UUID v7. */
  id: TId;

  createdAt: TDateOrStringDate;

  divisionId: IDivision['id'];

  priceSnapshotId: IPriceSnapshot['id'];
}
