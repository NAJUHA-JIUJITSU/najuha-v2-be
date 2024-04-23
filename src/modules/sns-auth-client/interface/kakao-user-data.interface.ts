/**
 * 카카오 사용자 데이터 인터페이스
 * 참조 : https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info
 */
export interface IKakaoUserData {
  /** 회원번호, API 호출을 통해 얻은 사용자의 고유 ID / Long 최대값 9,223,372,036,854,775,807 최대 19자리. */
  id: number;

  kakao_account: {
    /** 카카오계정 이름 / 200자 (100자 제한이나 추후 변경 가능성 대비). */
    name: string;

    /** 카카오계정 대표 이메일
     * 이메일은 로컬파트와 도메인파트로 나뉨
     * 로컬파트는 64자리, 도메인파트는 255자리
     * 총 길이는 320자리까지 가능
     * 출처(rfc 에서 정의하고 있음): https://www.ietf.org/rfc/rfc2821.txt.
     */
    email: string;

    /** 카카오계정의 전화번호
     * 100자 (국가번호 10자, 전호번호 20자 이나 국가에 따라 display phone number 는 + 및 공백이 포함될 수 있음)
     * 국내 번호인 경우 +82 00-0000-0000 형식
     * 해외 번호인 경우 자릿수, 붙임표(-) 유무나 위치가 다를 수 있음 (참고: libphonenumber).
     */
    phone_number: string;

    /** 성별 / female: 여성, male: 남성. */
    gender: string;

    /** 생일 / MMDD 형식. */
    birthday: string;

    /** 출생연도 / YYYY 형식. */
    birthyear: string;
  };
}
