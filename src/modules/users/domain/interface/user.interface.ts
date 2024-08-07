import { TId, TDateOrStringDate } from '../../../../common/common-types';
import { BirthDate } from '../../../../common/typia-custom-tags/birth-date.tag';
import { tags } from 'typia';
import { IUserProfileImage, IUserProfileImageModelData } from './user-profile-image.interface';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
/**
 * User.
 *
 * 사용자 정보.
 * @namespace User
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

  /**
   * SNS 공급자. User가 로그인하는데 사용한 SNS 플랫폼을 나타냅니다.
   * - KAKAO: 카카오.
   * - NAVER: 네이버.
   * - GOOGLE: 구글.
   * - APPLE: 애플.
   */
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

  /**
   * User 상태.
   * - ACTIVE: 활성.
   * - INACTIVE: 비활성.
   */
  status: 'ACTIVE' | 'INACTIVE';

  /** createdAt. */
  createdAt: TDateOrStringDate;

  updatedAt: TDateOrStringDate;

  profileImages: IUserProfileImage[];
}

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface IUserModelData {
  id: IUser['id'];
  role: IUser['role'];
  snsAuthProvider: IUser['snsAuthProvider'];
  snsId: IUser['snsId'];
  name: IUser['name'];
  email: IUser['email'];
  phoneNumber: IUser['phoneNumber'];
  nickname: IUser['nickname'];
  gender: IUser['gender'];
  birth: IUser['birth'];
  belt: IUser['belt'];
  status: IUser['status'];
  createdAt: IUser['createdAt'];
  updatedAt: IUser['updatedAt'];
  profileImages?: IUserProfileImageModelData[];
}

// ----------------------------------------------------------------------------
// Return Interface
// ----------------------------------------------------------------------------
export interface IUserDetail extends IUser {}

export interface IUserPublicProfile extends Pick<IUser, 'id' | 'role' | 'nickname' | 'profileImages'> {}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface IUserUpdateDto
  extends Pick<IUser, 'id'>,
    Partial<Pick<IUser, 'name' | 'nickname' | 'gender' | 'belt' | 'birth'>> {}
