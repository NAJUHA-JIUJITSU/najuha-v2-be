import { tags } from 'typia';
import { IDivision } from './division.interface';
import { DateOrStringDate } from 'src/common/common-types';

export interface IPriceSnapshot {
  /** ULID. */
  id: string & tags.MinLength<26> & tags.MaxLength<26>;

  /** price, (원). */
  price: number & tags.Type<'uint32'> & tags.Minimum<0>;

  /** CreatedAt. */
  createdAt: DateOrStringDate;

  /** Division id. */
  divisionId: IDivision['id'];
}
