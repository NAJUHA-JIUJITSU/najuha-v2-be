/** - 사용자가 동의한 약관 정보. */
export interface IPolicyConsent {
  /**
   * - 약관 동의 ID.
   * @type uint32
   */
  id: number;

  /** - 동의 날짜. */
  createdAt: Date | string;

  /** - userId. */
  userId: number;

  /** - policyId. */
  policyId: number;
}
