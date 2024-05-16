import { tags } from 'typia';
import { IDivision } from './division.interface';
import { DateOrStringDate } from 'src/common/common-types';

export interface IPriceSnapshot {
  /** UUIDv7. */
  id: string & tags.MinLength<36> & tags.MaxLength<36>;

  /** price, (원). */
  price: number & tags.Type<'uint32'> & tags.Minimum<0>;

  /** CreatedAt. */
  createdAt: DateOrStringDate;

  /** Division id. */
  divisionId: IDivision['id'];
}
