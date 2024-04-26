import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { IPriceSnapshot } from 'src/modules/competitions/domain/interface/price-snapshot.interface';
import { tags } from 'typia';

export interface IParticipationDivisionInfoPayment {
  /** ULID. */
  id: string & tags.MinLength<26> & tags.MaxLength<26>;

  createdAt: Date | (string & tags.Format<'date-time'>);

  divisionId: IDivision['id'];

  priceSnapshotId: IPriceSnapshot['id'];
}
