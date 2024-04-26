import { tags } from 'typia';
import { IDivision } from './division.interface';

export interface IPriceSnapshot {
  /** ULID. */
  id: string & tags.MinLength<26> & tags.MaxLength<26>;

  /** price, (원). */
  price: number & tags.Type<'uint32'> & tags.Minimum<0>;

  /** CreatedAt. */
  createdAt: Date | (string & tags.Format<'date-time'>);

  /** Division id. */
  divisionId: IDivision['id'];
}
