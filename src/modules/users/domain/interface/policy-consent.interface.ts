import { TId, TDateOrStringDate } from '../../../../common/common-types';
import { IUser } from './user.interface';

// --------------------------------------------------------------
// Base Interface
// --------------------------------------------------------------
/**
 * PolicyConsent
 *
 * - 사용자가 동의한 약관 정보.
 * @namespace User
 */
export interface IPolicyConsent {
  /** UUID v7. */
  id: TId;

  /** 약관 동의 날짜. */
  createdAt: TDateOrStringDate;

  /** UserId. */
  userId: IUser['id'];

  /** PolicyId. */
  policyId: IPolicyConsent['id'];
}

// --------------------------------------------------------------
// Model Data
// --------------------------------------------------------------
export interface IPolicyConsentModelData {
  id: IPolicyConsent['id'];
  createdAt: IPolicyConsent['createdAt'];
  userId: IPolicyConsent['userId'];
  policyId: IPolicyConsent['policyId'];
}

// --------------------------------------------------------------
// DTO
// --------------------------------------------------------------
export interface IPolicyConsentCreateDto extends Pick<IPolicyConsent, 'userId' | 'policyId'> {}
