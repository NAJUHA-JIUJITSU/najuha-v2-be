import { IUser } from './user.interface';
import { IPolicy } from './policy.interface';

/**
 * - 사용자가 동의한 약관 정보
 */
export interface IPolicyConsent {
  /**
   * - 약관 동의 ID.
   * @type uint32
   */
  id: number;

  /** - 동의 날짜. */
  createdAt: Date | string;

  /** - 사용자 ID. */
  userId: number;

  /**
   * - 사용자 정보
   * - ManyToOne: User(1) -> PolicyConsent(*)
   * - JoinColumn: userId
   */
  user?: IUser;

  /** - 약관 ID. */
  policyId: number;

  /**
   * - 약관 정보
   * - ManyToOne: Policy(1) -> PolicyConsent(*)
   * - JoinColumn: policyId
   */
  policy?: IPolicy;
}
