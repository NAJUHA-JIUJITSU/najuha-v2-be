import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { IPriceSnapshot } from 'src/modules/competitions/domain/interface/price-snapshot.interface';

export interface IParticipationDivisionInfoPayment {
  /**
   * - ULID.
   * @type string
   * @minLength 26
   * @maxLength 26
   */
  id: string;

  createdAt: Date | string;

  divisionId: IDivision['id'];

  priceSnapshotId: IPriceSnapshot['id'];
}
