import { UserEntity } from 'src/users/entities/user.entity';

export interface SnsAuthDto {
  /**
   * snsProvider.
   */
  snsAuthProvider: UserEntity['snsAuthProvider'];

  /**
   * authCode.
   */
  snsAuthCode: string;

  /**
   * snsAuthState.
   * Cross-Site Request Forgery(CSRF) 공격으로부터 카카오 로그인 요청을 보호하기 위해 사용.
   * 각 사용자의 로그인 요청에 대한 state 값은 고유해야 함.
   * 인가 코드 요청, 인가 코드 응답, 토큰 발급 요청의 state 값 일치 여부로 요청 및 응답 유효성 확인 가능.
   */
  snsAuthState: string;
}
