import { tags } from 'typia';
import { IDivision } from './division.interface';
import { TId, TDateOrStringDate } from 'src/common/common-types';

export interface IPriceSnapshot {
  /** UUIDv7. */
  id: TId;

  /** price, (원). */
  price: number & tags.Type<'uint32'> & tags.Minimum<0>;

  /** CreatedAt. */
  createdAt: TDateOrStringDate;

  /** Division id. */
  divisionId: IDivision['id'];
}
