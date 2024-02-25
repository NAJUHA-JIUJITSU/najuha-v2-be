/**
 * google 사용자 정보를 담는 인터페이스
 * 참조 : https://developers.google.com/admin-sdk/directory/reference/rest/v1/users?hl=ko
 */
export type GoogleUserData = {
  /**
   * https://community.auth0.com/t/is-256-a-safe-max-length-for-a-user-id/34040
   * 256 자면 충분할듯
   */
  sub: string;
  /** 회원가입시 새로 입력 받자. */
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
};
