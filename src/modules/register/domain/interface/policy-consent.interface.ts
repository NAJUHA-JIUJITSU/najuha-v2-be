import { TId, TDateOrStringDate } from '../../../../common/common-types';
import { IUser } from '../../../users/domain/interface/user.interface';
import { tags } from 'typia';

/** - 사용자가 동의한 약관 정보. */
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
