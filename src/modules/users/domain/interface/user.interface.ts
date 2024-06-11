import { TId, TDateOrStringDate } from 'src/common/common-types';
import { BirthDate } from 'src/common/typia-custom-tags/birth-date.tag';
import { Nullable } from 'src/common/utility-types';
import { IPolicyConsent } from 'src/modules/register/domain/interface/policy-consent.interface';
import { tags } from 'typia';
import { IUserProfileImage } from './user-profile-image.interface';

// Entity ---------------------------------------------------------------------
/**
 * 각 snsAuthProvider 마다 제공되는 정보.
 * - kakao  : snsId, email, name, phoneNumber, gender, birthday, birthyear.
 * - naver  : snsId, email, name, phoneNumber, gender, birthday, birthyear.
 * - google : snsId, email, name.
 * - apple  : snsId, email, name.
 */
export interface IUser {
  /** UUID v7. */
  id: TId;

  /**
   * User 역할. User의 접근 권한을 나타냅니다.
   * - ADMIN: 관리자 권한.
   * - HOST: 대회 주최자 권한.
   * - USER: 일반 User 권한.
   * - TEMPORARY_USER: 회원가입을 완료하지 않은 User 권한.
   */
  role: 'ADMIN' | 'HOST' | 'USER' | 'TEMPORARY_USER';

  /** SNS 공급자. User가 로그인하는데 사용한 SNS 플랫폼을 나타냅니다. */
  snsAuthProvider: 'KAKAO' | 'NAVER' | 'GOOGLE' | 'APPLE';

  /** SNS ID. 소셜 로그인을 위한 고유 식별자입니다. */
  snsId: string & tags.MinLength<1> & tags.MaxLength<256>;

  /** User 이메일 주소. */
  email: string & tags.MinLength<1> & tags.MaxLength<320> & tags.Format<'email'>;

  /**
   * User 이름.
   * - 컬럼길이는 256으로 설정하였으나, 입력값 유효성검사는 64자 이내로 설정하도록 합니다.
   * - User 이름은 한글, 영문, 숫자만 입력 가능합니다.
   */
  name: string & tags.MinLength<1> & tags.MaxLength<64> & tags.Pattern<'^[a-zA-Z0-9ㄱ-ㅎ가-힣]{1,64}$'>;

  /**
   * User 전화번호.
   * - 전화번호가 저장되어 있으면 인증된 전화번호 입니다.
   * - ex) 01012345678.
   */
  phoneNumber: string & tags.Pattern<'^01[0-9]{9}$'>;

  /**
   * User 별명.
   * - 영문, 한글, 숫자만 입력 가능합니다. */
  nickname: string & tags.MinLength<1> & tags.MaxLength<64> & tags.Pattern<'^[a-zA-Z0-9ㄱ-ㅎ가-힣]{1,64}$'>;

  /** User 성별. */
  gender: 'MALE' | 'FEMALE';

  /** User 생년월일 (BirtDate YYYYMMDD). */
  birth: string & BirthDate & tags.Pattern<'^[0-9]{8}$'>;

  /** User 주짓수 벨트. */
  belt: '선택없음' | '화이트' | '블루' | '퍼플' | '브라운' | '블랙';

  // /**
  //  * User 프로필 이미지 키 (이미지 파일 이름).
  //  * - 참고 s3 image key 최대길이 1024(https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html).
  //  */
  // profileImageUrlKey: null | (string & tags.MinLength<1> & tags.MaxLength<128>);

  /**
   * User 상태.
   * - ACTIVE: 활성.
   * - INACTIVE: 비활성.
   */
  status: 'ACTIVE' | 'INACTIVE';

  /** CreatedAt. */
  createdAt: TDateOrStringDate;

  /** UpdatedAt. */
  updatedAt: TDateOrStringDate;

  profileImages?: IUserProfileImage[];
}

export interface ITemporaryUser
  extends Pick<
      IUser,
      'id' | 'role' | 'snsAuthProvider' | 'snsId' | 'email' | 'name' | 'status' | 'createdAt' | 'updatedAt'
    >,
    Nullable<Pick<IUser, 'phoneNumber' | 'nickname' | 'gender' | 'birth' | 'belt'>> {}

export interface IRegisterUser extends ITemporaryUser {
  policyConsents: IPolicyConsent[];
}

// DTO ------------------------------------------------------------------------
export interface ITemporaryUserCreateDto
  extends Pick<IUser, 'snsAuthProvider' | 'snsId' | 'email' | 'name'>,
    Partial<Pick<IUser, 'phoneNumber' | 'gender' | 'birth'>> {}

export interface IUserUpdateDto
  extends Pick<IUser, 'id'>,
    Partial<Pick<IUser, 'name' | 'nickname' | 'gender' | 'belt' | 'birth'>> {}

export interface IUserRgistertDto extends Pick<IUser, 'id' | 'nickname' | 'gender' | 'belt' | 'birth'> {}
