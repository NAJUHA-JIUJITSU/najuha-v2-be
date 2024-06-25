import { tags } from 'typia';
import { IDivision } from './division.interface';
import { TId, TDateOrStringDate } from '../../../../common/common-types';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
export interface IPriceSnapshot {
  /** UUID v7. */
  id: TId;

  /** price, (원). */
  price: number & tags.Type<'uint32'> & tags.Minimum<0>;

  /** CreatedAt. */
  createdAt: TDateOrStringDate;

  /** Division id. */
  divisionId: IDivision['id'];
}

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface IPriceSnapshotModelData extends IPriceSnapshot {}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface IPriceSnapshotCreateDto {
  price: IPriceSnapshot['price'];
  divisionId: IPriceSnapshot['divisionId'];
}
