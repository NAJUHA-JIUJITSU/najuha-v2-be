import { HttpException, HttpStatus } from '@nestjs/common';
import typia from 'typia';

export interface ErrorResponse {
  result: boolean;
  status: HttpStatus;
  code: number | string;
  data: string;
  detail?: any;
}

export class BusinessException extends HttpException {
  constructor(errorResponse: ErrorResponse, errorDetail?: string) {
    errorResponse.detail = errorDetail;
    super(errorResponse, errorResponse.status);
  }
}

/** ----------------------------------------------------------------------------
 * Internal Server Error 500
 */
export interface INTERNAL_SERVER_ERROR extends ErrorResponse {
  result: false;
  status: HttpStatus.INTERNAL_SERVER_ERROR;
  code: 500;
  data: 'Internal Server Error';
}

/** ----------------------------------------------------------------------------
 * Auth 4000 ~ 4999
 */
export interface AUTH_ACCESS_TOKEN_MISSING extends ErrorResponse {
  result: false;
  status: HttpStatus.BAD_REQUEST;
  code: 4000;
  data: 'accssToken이 없습니다.';
}

export interface AUTH_ACCESS_TOKEN_UNAUTHORIZED extends ErrorResponse {
  result: false;
  status: HttpStatus.UNAUTHORIZED;
  code: 4001;
  data: '유효하지 않은 accessToken 입니다.';
}

export interface AUTH_REFRESH_TOKEN_UNAUTHORIZED extends ErrorResponse {
  result: false;
  status: HttpStatus.UNAUTHORIZED;
  code: 4002;
  data: '유효하지 않은 refreshToken 입니다.';
}

export interface AUTH_LEVEL_FORBIDDEN extends ErrorResponse {
  result: false;
  status: HttpStatus.FORBIDDEN;
  code: 4003;
  data: '권한이 없습니다.';
}

export const AuthErrorMap = {
  AUTH_ACCESS_TOKEN_MISSING: typia.random<AUTH_ACCESS_TOKEN_MISSING>(),
  AUTH_ACCESS_TOKEN_UNAUTHORIZED:
    typia.random<AUTH_ACCESS_TOKEN_UNAUTHORIZED>(),
  AUTH_REFRESH_TOKEN_UNAUTHORIZED:
    typia.random<AUTH_REFRESH_TOKEN_UNAUTHORIZED>(),
  AUTH_LEVEL_FORBIDDEN: typia.random<AUTH_LEVEL_FORBIDDEN>(),
};

/** ----------------------------------------------------------------------------
 * SnsAuth 5000 ~ 5999
 */
export interface SNS_AUTH_NOT_SUPPORTED_SNS_PROVIDER extends ErrorResponse {
  result: false;
  status: HttpStatus.BAD_REQUEST;
  code: 5000;
  data: '지원하지 않는 SNS AUTH PROVIDER 입니다.';
}

export interface SNS_AUTH_KAKAO_LOGIN_FAIL extends ErrorResponse {
  result: false;
  status: HttpStatus.BAD_REQUEST;
  code: 5001;
  data: '카카오 로그인에 실패했습니다.';
}

export interface SNS_AUTH_NAVER_LOGIN_FAIL extends ErrorResponse {
  result: false;
  status: HttpStatus.BAD_REQUEST;
  code: 5002;
  data: '네이버 로그인에 실패했습니다.';
}

export interface SNS_AUTH_GOOGLE_LOGIN_FAIL extends ErrorResponse {
  result: false;
  status: HttpStatus.BAD_REQUEST;
  code: 5003;
  data: '구글 로그인에 실패했습니다.';
}

export const SnsAuthErrorMap = {
  SNS_AUTH_NOT_SUPPORTED_SNS_PROVIDER:
    typia.random<SNS_AUTH_NOT_SUPPORTED_SNS_PROVIDER>(),
  SNS_AUTH_KAKAO_LOGIN_FAIL: typia.random<SNS_AUTH_KAKAO_LOGIN_FAIL>(),
  SNS_AUTH_NAVER_LOGIN_FAIL: typia.random<SNS_AUTH_NAVER_LOGIN_FAIL>(),
  SNS_AUTH_GOOGLE_LOGIN_FAIL: typia.random<SNS_AUTH_GOOGLE_LOGIN_FAIL>(),
};

/** ----------------------------------------------------------------------------
 * Users 6000 ~ 6999
 */
export interface USERS_NOT_FOUND extends ErrorResponse {
  result: false;
  status: HttpStatus.NOT_FOUND;
  code: 6001;
  data: '존재하지 않는 유저입니다.';
}

export const UsersErrorMap = {
  USERS_NOT_FOUND: typia.random<USERS_NOT_FOUND>(),
};
