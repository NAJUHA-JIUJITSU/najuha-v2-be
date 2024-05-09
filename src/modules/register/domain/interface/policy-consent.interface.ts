import { DateOrStringDate } from 'src/common/common-types';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { tags } from 'typia';

/** - 사용자가 동의한 약관 정보. */
export interface IPolicyConsent {
  /** ULID. */
  id: string & tags.MinLength<26> & tags.MaxLength<26>;

  /** 약관 동의 날짜. */
  createdAt: DateOrStringDate;

  /** UserId. */
  userId: IUser['id'];

  /** PolicyId. */
  policyId: IPolicyConsent['id'];
}
