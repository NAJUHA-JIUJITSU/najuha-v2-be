import { TId, TDateOrStringDate } from 'src/common/common-types';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { IPriceSnapshot } from 'src/modules/competitions/domain/interface/price-snapshot.interface';
import { tags } from 'typia';

export interface IParticipationDivisionInfoPayment {
  /** UUID v7. */
  id: TId;

  createdAt: TDateOrStringDate;

  divisionId: IDivision['id'];

  priceSnapshotId: IPriceSnapshot['id'];
}
