/** - 사용자가 동의한 약관 정보. */
export interface IPolicyConsent {
  /**
   * - id.
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
