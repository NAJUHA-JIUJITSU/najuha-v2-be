import { IDivision } from './division.interface';
import { TId, TDateOrStringDate, TMoneyValue } from '../../../../common/common-types';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
/**
 * PriceSnapshot.
 *
 * 대회 부문이 가격 스냅샷.
 * - 대회 부문의 가격이 변경될때마다 스냅샷을 생성한다.
 */
export interface IPriceSnapshot {
  /** UUID v7. */
  id: TId;

  /** price, (원). */
  price: TMoneyValue;

  /** createdAt. */
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
