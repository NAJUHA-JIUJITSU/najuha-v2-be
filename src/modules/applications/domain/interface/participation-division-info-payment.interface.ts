import { DateOrStringDate } from 'src/common/common-types';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { IPriceSnapshot } from 'src/modules/competitions/domain/interface/price-snapshot.interface';
import { tags } from 'typia';

export interface IParticipationDivisionInfoPayment {
  /** UUIDv7. */
  id: string & tags.MinLength<36> & tags.MaxLength<36>;

  createdAt: DateOrStringDate;

  divisionId: IDivision['id'];

  priceSnapshotId: IPriceSnapshot['id'];
}
