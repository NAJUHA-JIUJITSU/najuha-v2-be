/**
 * 카카오 사용자 데이터 인터페이스
 * 사용자 정보 가져오기 API 문서 참조 - https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info
 */
export interface KakaoUserData {
  /** Long 최대값 9,223,372,036,854,775,807 최대 19자리 / 회원번호, API 호출을 통해 얻은 사용자의 고유 ID */
  id: number;

  /** Datetime / 서비스에 연결 완료된 시각, UTC */
  connected_at: string;

  /** JSON / 사용자 프로퍼티(Property), 사용자에 대한 추가적인 정보 */
  properties: Properties;

  /** KakaoAccount / 카카오계정 정보, 사용자의 카카오계정과 관련된 정보 */
  kakao_account: KakaoAccount;
}

/** 사용자 프로퍼티(Property) 인터페이스 */
interface Properties {
  /** String / 사용자 닉네임, 사용자가 설정한 별명 */
  nickname: string;

  /** String / 사용자 프로필 사진 URL, 사용자가 설정한 프로필 이미지의 URL */
  profile_image: string;

  /** String / 사용자 썸네일 프로필 사진 URL, 프로필 이미지의 썸네일 버전 URL */
  thumbnail_image: string;
}

/** 카카오계정 정보 인터페이스 */
interface KakaoAccount {
  /** Boolean / 사용자 동의 시 프로필 정보(닉네임/프로필 사진) 제공 가능 여부 */
  profile_needs_agreement: boolean;

  /** Boolean / 사용자 동의 시 닉네임 제공 가능 여부 */
  profile_nickname_needs_agreement: boolean;

  /** Boolean / 사용자 동의 시 프로필 사진 제공 가능 여부 */
  profile_image_needs_agreement: boolean;

  /** Profile / 프로필 정보 */
  profile: Profile;

  /** Boolean / 사용자 동의 시 카카오계정 이름 제공 가능 여부 */
  name_needs_agreement: boolean;

  /** String / 카카오계정 이름 */
  name: string;

  /** Boolean / 사용자 동의 시 카카오계정 대표 이메일 제공 가능 여부 */
  email_needs_agreement: boolean;

  /** Boolean / 이메일 유효 여부 */
  is_email_valid: boolean;

  /** Boolean / 이메일 인증 여부 */
  is_email_verified: boolean;

  /** String / 카카오계정 대표 이메일 */
  email: string;

  /** Boolean / 사용자 동의 시 연령대 제공 가능 여부 */
  age_range_needs_agreement: boolean;

  /** String / 연령대 ex -1~9: 1세 이상 10세 미만*/
  age_range: string;

  /** Boolean / 사용자 동의 시 출생 연도 제공 가능 여부 */
  birthyear_needs_agreement: boolean;

  /** String / 출생 연도 (YYYY 형식) */
  birthyear: string;

  /** Boolean / 사용자 동의 시 생일 제공 가능 여부 */
  birthday_needs_agreement: boolean;

  /** String / 생일 (MMDD 형식) */
  birthday: string;

  /** String / 생일 타입 (SOLAR: 양력, LUNAR: 음력) */
  birthday_type: string;

  /** Boolean / 사용자 동의 시 성별 제공 가능 여부 */
  gender_needs_agreement: boolean;

  /** String / 성별 (female: 여성, male: 남성) */
  gender: string;

  /** Boolean / 사용자 동의 시 전화번호 제공 가능 여부 */
  phone_number_needs_agreement: boolean;

  /** String / 카카오계정의 전화번호.
   * 국내 번호인 경우 +82 00-0000-0000 형식.
   * 해외 번호인 경우 자릿수, 붙임표(-) 유무나 위치가 다를 수 있음 (참고: libphonenumber).
   */
  phone_number: string;

  /** Boolean / 사용자 동의 시 CI 제공 가능 여부 */
  ci_needs_agreement: boolean;

  /** String / 연계정보 (CI), 사용자 식별에 사용되는 고유 정보 */
  ci: string;

  /** Datetime / CI 발급 시각, UTC */
  ci_authenticated_at: string;
}

/** 카카오 사용자 프로필 정보 인터페이스 */
interface Profile {
  /** String / 닉네임, 사용자의 카카오 계정 닉네임 */
  nickname: string;

  /** String / 프로필 미리보기 이미지 URL, 110px * 110px 또는 100px * 100px */
  thumbnail_image_url: string;

  /** String / 프로필 사진 URL, 640px * 640px 또는 480px * 480px */
  profile_image_url: string;

  /** Boolean / 프로필 사진 URL이 기본 프로필 사진 URL인지 여부, 기본 사진 여부를 나타냄 */
  is_default_image: boolean;
}
