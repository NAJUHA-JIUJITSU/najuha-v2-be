/**
 * 네이버 사용자 데이터를 나타내는 인터페이스
 * 네이버 로그인 회원의 프로필 정보 - https://developers.naver.com/docs/login/devguide/devguide.md#3-3-1-%EB%84%A4%EC%9D%B4%EB%B2%84-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%ED%9A%8C%EC%9B%90%EC%9D%98-%ED%94%84%EB%A1%9C%ED%95%84-%EC%A0%95%EB%B3%B4
 * 회원 프로필 조회 API 명세 - https://developers.naver.com/docs/login/profile/profile.md#:~:text=/QlJAgUukpp1OGkG0vzi16hcRNYX6RcQ6kPxB0oAvqfUPJiJw%3D%3D-,5.%20%EC%B6%9C%EB%A0%A5%20%EA%B2%B0%EA%B3%BC,-%ED%9A%8C%EC%9B%90%EC%9D%98%20%EB%84%A4%EC%9D%B4%EB%B2%84%EC%95%84%EC%9D%B4%EB%94%94%EB%8A%94%20%EC%B6%9C%EB%A0%A5%EA%B2%B0%EA%B3%BC%EC%97%90
 */
export interface NaverUserData {
  /** 네이버 아이디마다 고유하게 발급되는 유니크한 일련번호 값.
   * 이용자 식별자: 64자 이내로 구성된 BASE64 형식의 문자열.
   * (2021년 5월 1일 이후 생성된 애플리케이션부터 적용. 기존 INT64 규격의 숫자).
   *
   * NAJUAH NAVER APP 은 BASE64 형식의 문자열로 적용됨.
   */
  id: string;

  /** 사용자 이름. maxLength 10 */
  name: string;

  /** 사용자 별명. 별명이 설정되어 있지 않으면 id*** 형태로 리턴됩니다. maxLength 20 */
  nickname: string;

  /** 사용자 프로필 사진 URL. format url maxLength 255 */
  profile_image: string;

  /** 사용자 연령대: '0-9' | '10-19' | '20-29' | '30-39' | '40-49' | '50-59' | '60-'. */
  age: string;

  /** 성별. F: 여성, M: 남성, U: 확인불가. */
  gender: 'F' | 'M' | 'U';

  /** 사용자 메일 주소. 기본적으로 네이버 내정보에 등록된 '기본 이메일'이나, 사용자가 다른 외부메일로 변경했을 경우는 변경된 이메일 주소로 제공됩니다. format email */
  email: string;

  /** 휴대전화번호: 대쉬(-)를 포함한 휴대전화번호 문자열 (010-0000-0000). */
  mobile: string;

  /** 사용자 생일(MM-DD 형식). */
  birthday: string;

  /** 출생연도: 연(YYYY) 형태의 문자열. */
  birthyear: string;
}
