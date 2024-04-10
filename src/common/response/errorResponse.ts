import { HttpException, HttpStatus } from '@nestjs/common';
import exp from 'constants';
import typia from 'typia';

export type ErrorResponse = {
  isSuccess: false;
  status: HttpStatus;
  code: number | string;
  result: string;
  detail?: any;
};

export class BusinessException extends HttpException {
  constructor(errorResponse: ErrorResponse, errorDetail?: string) {
    errorResponse.detail = errorDetail;
    super(errorResponse, errorResponse.status);
  }
}

/** ----------------------------------------------------------------------------
 * Internal Server Error 500
 */
export type INTERNAL_SERVER_ERROR = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.INTERNAL_SERVER_ERROR;
  code: 500;
  result: 'Internal Server Error';
};

/** ----------------------------------------------------------------------------
 * - Entity Not Found Error 404
 */
export type ENTITY_NOT_FOUND = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.NOT_FOUND;
  code: 404;
  result: 'Entity Not Found';
};

export const CommonErrorMap = {
  INTERNAL_SERVER_ERROR: typia.random<INTERNAL_SERVER_ERROR>(),
  ENTITY_NOT_FOUND: typia.random<ENTITY_NOT_FOUND>(),
};

/** ----------------------------------------------------------------------------
 * Auth 1000 ~ 1999
 */
export type AUTH_ACCESS_TOKEN_MISSING = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 1000;
  result: 'accssToken이 없습니다.';
};

export type AUTH_ACCESS_TOKEN_UNAUTHORIZED = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.UNAUTHORIZED;
  code: 1001;
  result: '유효하지 않은 accessToken 입니다.';
};

export type AUTH_REFRESH_TOKEN_UNAUTHORIZED = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.UNAUTHORIZED;
  code: 1002;
  result: '유효하지 않은 refreshToken 입니다.';
};

export type AUTH_LEVEL_FORBIDDEN = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.FORBIDDEN;
  code: 1003;
  result: 'API 호출 권한이 없습니다.';
};

export type AUTH_UNREGISTERED_ADMIN_CREDENTIALS = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.FORBIDDEN;
  code: 1004;
  result: '등록되지 않은 관리자 계정입니다.';
};

export const AuthErrorMap = {
  AUTH_ACCESS_TOKEN_MISSING: typia.random<AUTH_ACCESS_TOKEN_MISSING>(),
  AUTH_ACCESS_TOKEN_UNAUTHORIZED: typia.random<AUTH_ACCESS_TOKEN_UNAUTHORIZED>(),
  AUTH_REFRESH_TOKEN_UNAUTHORIZED: typia.random<AUTH_REFRESH_TOKEN_UNAUTHORIZED>(),
  AUTH_LEVEL_FORBIDDEN: typia.random<AUTH_LEVEL_FORBIDDEN>(),
  AUTH_UNREGISTERED_ADMIN_CREDENTIALS: typia.random<AUTH_UNREGISTERED_ADMIN_CREDENTIALS>(),
};

/** ----------------------------------------------------------------------------
 * SnsAuth 2000 ~ 2999
 */
export type SNS_AUTH_NOT_SUPPORTED_SNS_PROVIDER = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 2000;
  result: '지원하지 않는 SNS AUTH PROVIDER 입니다.';
};

export type SNS_AUTH_KAKAO_LOGIN_FAIL = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 2001;
  result: '카카오 로그인에 실패했습니다.';
};

export type SNS_AUTH_NAVER_LOGIN_FAIL = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 2002;
  result: '네이버 로그인에 실패했습니다.';
};

export type SNS_AUTH_GOOGLE_LOGIN_FAIL = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 2003;
  result: '구글 로그인에 실패했습니다.';
};

export const SnsAuthErrorMap = {
  SNS_AUTH_NOT_SUPPORTED_SNS_PROVIDER: typia.random<SNS_AUTH_NOT_SUPPORTED_SNS_PROVIDER>(),
  SNS_AUTH_KAKAO_LOGIN_FAIL: typia.random<SNS_AUTH_KAKAO_LOGIN_FAIL>(),
  SNS_AUTH_NAVER_LOGIN_FAIL: typia.random<SNS_AUTH_NAVER_LOGIN_FAIL>(),
  SNS_AUTH_GOOGLE_LOGIN_FAIL: typia.random<SNS_AUTH_GOOGLE_LOGIN_FAIL>(),
};

/** ----------------------------------------------------------------------------
 * Register 3000 ~ 3999
 */
export type REGISTER_NICKNAME_DUPLICATED = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.CONFLICT;
  code: 3000;
  result: '이미 사용중인 닉네임입니다.';
};

export type REGISTER_BIRTH_INVALID = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 3001;
  result: '생년월일이 유효하지 않습니다.';
};

export type REGISTER_POLICY_CONSENT_REQUIRED = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 3002;
  result: '필수 동의 항목을 모두 동의해야 합니다.';
};

export type REGISTER_PHONE_NUMBER_REQUIRED = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 3003;
  result: '회원가입을 위해서는 휴대폰 번호인증이 필요합니다.';
};

export const RegisterErrorMap = {
  REGISTER_NICKNAME_DUPLICATED: typia.random<REGISTER_NICKNAME_DUPLICATED>(),
  REGISTER_BIRTH_INVALID: typia.random<REGISTER_BIRTH_INVALID>(),
  REGISTER_POLICY_CONSENT_REQUIRED: typia.random<REGISTER_POLICY_CONSENT_REQUIRED>(),
  REGISTER_PHONE_NUMBER_REQUIRED: typia.random<REGISTER_PHONE_NUMBER_REQUIRED>(),
};

/** ----------------------------------------------------------------------------
 * Users 4000 ~ 4999
 */
// export type USERS_USER_NOT_FOUND = ErrorResponse & {
//   isSuccess: false;
//   status: HttpStatus.NOT_FOUND;
//   code: 4001;
//   result: '존재하지 않는 유저입니다.';
// };

export const UsersErrorMap = {};

/** ----------------------------------------------------------------------------
 * Policy 5000 ~ 5999
 */
// export type POLICY_POLICY_NOT_FOUND = ErrorResponse & {
//   isSuccess: false;
//   status: HttpStatus.NOT_FOUND;
//   code: 5000;
//   result: '존재하지 않는 약관입니다.';
// };

export const PolicyErrorMap = {};

/** ----------------------------------------------------------------------------
 * Competitions 6000 ~ 6999
 */
export type COMPETITIONS_COMPETITION_STATUS_CANNOT_BE_ACTIVE = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 6000;
  result: '대회의 상태를 ACTIVE로 변경할 수 없습니다.';
};

export type COMPETITIONS_DIVISION_DUPLICATED = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 6001;
  result: '대회 부문이 중복되었습니다.';
};

export const CompetitionsErrorMap = {
  COMPETITIONS_COMPETITION_STATUS_CANNOT_BE_ACTIVE: typia.random<COMPETITIONS_COMPETITION_STATUS_CANNOT_BE_ACTIVE>(),
  COMPETITIONS_DIVISION_DUPLICATED: typia.random<COMPETITIONS_DIVISION_DUPLICATED>(),
};

/** ----------------------------------------------------------------------------
 * Applications 7000 ~ 7999
 */

export type APPLICATIONS_DIVISION_NOT_FOUND = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.NOT_FOUND;
  code: 7000;
  result: '신청 부문을 찾을 수 없습니다.';
};

export type APPLICATIONS_DIVISION_AGE_NOT_MATCH = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 7001;
  result: '신청 부문의 나이가 맞지 않습니다.';
};

export type APPLICATIONS_DIVISION_GENDER_NOT_MATCH = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 7002;
  result: '신청 부문의 성별이 맞지 않습니다.';
};

export type APPLICATIONS_REGISTRATION_NOT_STARTED = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 7003;
  result: '대회 신청 기간 이전입니다.';
};

export type APPLICATIONS_REGISTRATION_ENDED = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 7004;
  result: '대회 신청 기간이 종료되었습니다.';
};

export const ApplicationsErrorMap = {
  APPLICATIONS_DIVISION_NOT_FOUND: typia.random<APPLICATIONS_DIVISION_NOT_FOUND>(),
  APPLICATIONS_DIVISION_AGE_NOT_MATCH: typia.random<APPLICATIONS_DIVISION_AGE_NOT_MATCH>(),
  APPLICATIONS_DIVISION_GENDER_NOT_MATCH: typia.random<APPLICATIONS_DIVISION_GENDER_NOT_MATCH>(),
  APPLICATIONS_REGISTRATION_NOT_STARTED: typia.random<APPLICATIONS_REGISTRATION_NOT_STARTED>(),
  APPLICATIONS_REGISTRATION_ENDED: typia.random<APPLICATIONS_REGISTRATION_ENDED>(),
};
