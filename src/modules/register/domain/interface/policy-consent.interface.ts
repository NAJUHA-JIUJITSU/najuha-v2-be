/** - 사용자가 동의한 약관 정보. */
export interface IPolicyConsent {
  /**
   * - ULID.
   * @type string
   * @minLength 26
   * @maxLength 26
   */
  id: string;

  /** - 동의 날짜. */
  createdAt: Date | string;

  /** - userId. */
  userId: number;

  /** - policyId. */
  policyId: number;
}
