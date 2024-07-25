/**
 * AuthTokens interface.
 */
export interface IAuthTokens {
  /**
   * accessToken.
   *
   * - JWT token.
   * - 15분 만료.
   */
  accessToken: string;

  /**
   * refreshToken.
   *
   * - JWT token.
   * - 14일 만료.
   */
  refreshToken: string;
}
