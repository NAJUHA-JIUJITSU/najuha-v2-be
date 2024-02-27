import { HttpException, HttpStatus } from '@nestjs/common';
import exp from 'constants';
import typia from 'typia';

export type ErrorResponse = {
  result: boolean;
  status: HttpStatus;
  code: number | string;
  data: string;
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
  result: false;
  status: HttpStatus.INTERNAL_SERVER_ERROR;
  code: 500;
  data: 'Internal Server Error';
};

/** ----------------------------------------------------------------------------
 * Auth 1000 ~ 1999
 */
export type AUTH_ACCESS_TOKEN_MISSING = ErrorResponse & {
  result: false;
  status: HttpStatus.BAD_REQUEST;
  code: 1000;
  data: 'accssToken이 없습니다.';
};

export type AUTH_ACCESS_TOKEN_UNAUTHORIZED = ErrorResponse & {
  result: false;
  status: HttpStatus.UNAUTHORIZED;
  code: 1001;
  data: '유효하지 않은 accessToken 입니다.';
};

export type AUTH_REFRESH_TOKEN_UNAUTHORIZED = ErrorResponse & {
  result: false;
  status: HttpStatus.UNAUTHORIZED;
  code: 1002;
  data: '유효하지 않은 refreshToken 입니다.';
};

export type AUTH_LEVEL_FORBIDDEN = ErrorResponse & {
  result: false;
  status: HttpStatus.FORBIDDEN;
  code: 1003;
  data: '권한이 없습니다.';
};

export type AUTH_UNREGISTERED_ADMIN_CREDENTIALS = ErrorResponse & {
  result: false;
  status: HttpStatus.FORBIDDEN;
  code: 1004;
  data: '등록되지 않은 관리자 계정입니다.';
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
  result: false;
  status: HttpStatus.BAD_REQUEST;
  code: 2000;
  data: '지원하지 않는 SNS AUTH PROVIDER 입니다.';
};

export type SNS_AUTH_KAKAO_LOGIN_FAIL = ErrorResponse & {
  result: false;
  status: HttpStatus.BAD_REQUEST;
  code: 2001;
  data: '카카오 로그인에 실패했습니다.';
};

export type SNS_AUTH_NAVER_LOGIN_FAIL = ErrorResponse & {
  result: false;
  status: HttpStatus.BAD_REQUEST;
  code: 2002;
  data: '네이버 로그인에 실패했습니다.';
};

export type SNS_AUTH_GOOGLE_LOGIN_FAIL = ErrorResponse & {
  result: false;
  status: HttpStatus.BAD_REQUEST;
  code: 2003;
  data: '구글 로그인에 실패했습니다.';
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
  result: false;
  status: HttpStatus.CONFLICT;
  code: 3000;
  data: '이미 사용중인 닉네임입니다.';
};

export type REGISTER_BIRTH_INVALID = ErrorResponse & {
  result: false;
  status: HttpStatus.BAD_REQUEST;
  code: 3001;
  data: '생년월일이 유효하지 않습니다.';
};

export type REGISTER_POLICY_CONSENT_REQUIRED = ErrorResponse & {
  result: false;
  status: HttpStatus.BAD_REQUEST;
  code: 3002;
  data: '필수 동의 항목을 모두 동의해야 합니다.';
};

export const RegisterErrorMap = {
  REGISTER_NICKNAME_DUPLICATED: typia.random<REGISTER_NICKNAME_DUPLICATED>(),
  REGISTER_BIRTH_INVALID: typia.random<REGISTER_BIRTH_INVALID>(),
  REGISTER_POLICY_CONSENT_REQUIRED: typia.random<REGISTER_POLICY_CONSENT_REQUIRED>(),
};

/** ----------------------------------------------------------------------------
 * Users 4000 ~ 4999
 */
export type USERS_USER_NOT_FOUND = ErrorResponse & {
  result: false;
  status: HttpStatus.NOT_FOUND;
  code: 4001;
  data: '존재하지 않는 유저입니다.';
};

export const UsersErrorMap = {
  USERS_USER_NOT_FOUND: typia.random<USERS_USER_NOT_FOUND>(),
};
