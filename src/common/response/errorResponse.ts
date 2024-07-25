import { HttpException, HttpStatus } from '@nestjs/common';
import exp from 'constants';
import typia from 'typia';

export type AllErrorTypes =
  | INTERNAL_SERVER_ERROR
  | ENTITY_NOT_FOUND
  | AUTH_ACCESS_TOKEN_MISSING
  | AUTH_ACCESS_TOKEN_UNAUTHORIZED
  | AUTH_REFRESH_TOKEN_UNAUTHORIZED
  | AUTH_LEVEL_FORBIDDEN
  | AUTH_UNREGISTERED_ADMIN_CREDENTIALS
  | SNS_AUTH_NOT_SUPPORTED_SNS_PROVIDER
  | SNS_AUTH_KAKAO_LOGIN_FAIL
  | SNS_AUTH_NAVER_LOGIN_FAIL
  | SNS_AUTH_GOOGLE_LOGIN_FAIL
  | REGISTER_NICKNAME_DUPLICATED
  | REGISTER_BIRTH_INVALID
  | REGISTER_POLICY_CONSENT_REQUIRED
  | REGISTER_PHONE_NUMBER_REQUIRED
  | COMPETITIONS_COMPETITION_STATUS_CANNOT_BE_ACTIVE
  | COMPETITIONS_DIVISION_DUPLICATED
  | COMPETITIONS_REQUIRED_ADDITIONAL_INFO_DUPLICATED
  | APPLICATIONS_DIVISION_NOT_FOUND
  | APPLICATIONS_DIVISION_AGE_NOT_MATCH
  | APPLICATIONS_DIVISION_GENDER_NOT_MATCH
  // | APPLICATIONS_REGISTRATION_NOT_STARTED
  // | APPLICATIONS_REGISTRATION_ENDED
  | APPLICATIONS_PLAYER_SNAPSHOT_OR_DIVISION_INFO_REQUIRED
  | APPLICATIONS_SELF_APPLICATION_NOT_ALLOWED
  | APPLICATIONS_PARTICIPATION_DIVISION_INFO_NOT_FOUND
  | APPLICATIONS_REQUIRED_ADDITIONAL_INFO_NOT_MATCH
  | APPLICATIONS_ADDITIONAL_INFO_NOT_FOUND
  | POSTS_POST_LIKE_ALREADY_EXIST
  | POSTS_POST_REPORT_ALREADY_EXIST
  | POSTS_COMMENT_LIKE_ALREADY_EXIST
  | POSTS_COMMENT_REPORT_ALREADY_EXIST
  | POSTS_COMMENT_REPLY_TO_REPLY_NOT_ALLOWED
  | VIEW_COUNT_IVALID_ENTITY_TYPE;

export type ErrorResponse = {
  isSuccess: false;
  status: HttpStatus;
  code: number;
  type: string;
  result: string;
  detail?: any;
};

export class BusinessException extends HttpException {
  constructor(errorResponse: ErrorResponse, errorDetail?: string) {
    errorResponse.detail = errorDetail;
    super(errorResponse, errorResponse.status);
  }
}

// -----------------------------------------------------------------------------
// Internal Server Error 500
// -----------------------------------------------------------------------------
export type INTERNAL_SERVER_ERROR = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.INTERNAL_SERVER_ERROR;
  code: 500;
  type: 'INTERNAL_SERVER_ERROR';
  result: 'Internal Server Error';
};

// -----------------------------------------------------------------------------
// Entity Not Found Error 404
// -----------------------------------------------------------------------------
export type ENTITY_NOT_FOUND = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.NOT_FOUND;
  code: 404;
  type: 'ENTITY_NOT_FOUND';
  result: 'Entity Not Found';
};

export const CommonErrors = {
  INTERNAL_SERVER_ERROR: typia.random<INTERNAL_SERVER_ERROR>(),
  ENTITY_NOT_FOUND: typia.random<ENTITY_NOT_FOUND>(),
};

// -----------------------------------------------------------------------------
//  Auth 1000 ~ 1999
// -----------------------------------------------------------------------------
export type AUTH_ACCESS_TOKEN_MISSING = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 1000;
  type: 'AUTH_ACCESS_TOKEN_MISSING';
  result: 'accssToken이 없습니다.';
};

export type AUTH_ACCESS_TOKEN_UNAUTHORIZED = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.UNAUTHORIZED;
  code: 1001;
  type: 'AUTH_ACCESS_TOKEN_UNAUTHORIZED';
  result: '유효하지 않은 accessToken 입니다.';
};

export type AUTH_REFRESH_TOKEN_UNAUTHORIZED = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.UNAUTHORIZED;
  code: 1002;
  type: 'AUTH_REFRESH_TOKEN_UNAUTHORIZED';
  result: '유효하지 않은 refreshToken 입니다.';
};

export type AUTH_LEVEL_FORBIDDEN = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.FORBIDDEN;
  code: 1003;
  type: 'AUTH_LEVEL_FORBIDDEN';
  result: 'API 호출 권한이 없습니다.';
};

export type AUTH_UNREGISTERED_ADMIN_CREDENTIALS = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.FORBIDDEN;
  code: 1004;
  type: 'AUTH_UNREGISTERED_ADMIN_CREDENTIALS';
  result: '등록되지 않은 관리자 계정입니다.';
};

export const AuthErrors = {
  AUTH_ACCESS_TOKEN_MISSING: typia.random<AUTH_ACCESS_TOKEN_MISSING>(),
  AUTH_ACCESS_TOKEN_UNAUTHORIZED: typia.random<AUTH_ACCESS_TOKEN_UNAUTHORIZED>(),
  AUTH_REFRESH_TOKEN_UNAUTHORIZED: typia.random<AUTH_REFRESH_TOKEN_UNAUTHORIZED>(),
  AUTH_LEVEL_FORBIDDEN: typia.random<AUTH_LEVEL_FORBIDDEN>(),
  AUTH_UNREGISTERED_ADMIN_CREDENTIALS: typia.random<AUTH_UNREGISTERED_ADMIN_CREDENTIALS>(),
};

// -----------------------------------------------------------------------------
// SnsAuth 2000 ~ 2999
// -----------------------------------------------------------------------------
export type SNS_AUTH_NOT_SUPPORTED_SNS_PROVIDER = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 2000;
  type: 'SNS_AUTH_NOT_SUPPORTED_SNS_PROVIDER';
  result: '지원하지 않는 SNS AUTH PROVIDER 입니다.';
};

export type SNS_AUTH_KAKAO_LOGIN_FAIL = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 2001;
  type: 'SNS_AUTH_KAKAO_LOGIN_FAIL';
  result: '카카오 로그인에 실패했습니다.';
};

export type SNS_AUTH_NAVER_LOGIN_FAIL = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 2002;
  type: 'SNS_AUTH_NAVER_LOGIN_FAIL';
  result: '네이버 로그인에 실패했습니다.';
};

export type SNS_AUTH_GOOGLE_LOGIN_FAIL = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 2003;
  type: 'SNS_AUTH_GOOGLE_LOGIN_FAIL';
  result: '구글 로그인에 실패했습니다.';
};

export const SnsAuthErrors = {
  SNS_AUTH_NOT_SUPPORTED_SNS_PROVIDER: typia.random<SNS_AUTH_NOT_SUPPORTED_SNS_PROVIDER>(),
  SNS_AUTH_KAKAO_LOGIN_FAIL: typia.random<SNS_AUTH_KAKAO_LOGIN_FAIL>(),
  SNS_AUTH_NAVER_LOGIN_FAIL: typia.random<SNS_AUTH_NAVER_LOGIN_FAIL>(),
  SNS_AUTH_GOOGLE_LOGIN_FAIL: typia.random<SNS_AUTH_GOOGLE_LOGIN_FAIL>(),
};

// -----------------------------------------------------------------------------
// Register 3000 ~ 3999
// -----------------------------------------------------------------------------
export type REGISTER_NICKNAME_DUPLICATED = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.CONFLICT;
  code: 3000;
  type: 'REGISTER_NICKNAME_DUPLICATED';
  result: '이미 사용중인 닉네임입니다.';
};

export type REGISTER_BIRTH_INVALID = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 3001;
  type: 'REGISTER_BIRTH_INVALID';
  result: '생년월일이 유효하지 않습니다.';
};

export type REGISTER_POLICY_CONSENT_REQUIRED = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 3002;
  type: 'REGISTER_POLICY_CONSENT_REQUIRED';
  result: '필수 동의 항목을 모두 동의해야 합니다.';
};

export type REGISTER_PHONE_NUMBER_REQUIRED = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 3003;
  type: 'REGISTER_PHONE_NUMBER_REQUIRED';
  result: '회원가입을 위해서는 휴대폰 번호인증이 필요합니다.';
};

export const RegisterErrors = {
  REGISTER_NICKNAME_DUPLICATED: typia.random<REGISTER_NICKNAME_DUPLICATED>(),
  REGISTER_BIRTH_INVALID: typia.random<REGISTER_BIRTH_INVALID>(),
  REGISTER_POLICY_CONSENT_REQUIRED: typia.random<REGISTER_POLICY_CONSENT_REQUIRED>(),
  REGISTER_PHONE_NUMBER_REQUIRED: typia.random<REGISTER_PHONE_NUMBER_REQUIRED>(),
};

// -----------------------------------------------------------------------------
// Users 4000 ~ 4999
// -----------------------------------------------------------------------------
// export type USERS_USER_NOT_FOUND = ErrorResponse & {
//   isSuccess: false;
//   status: HttpStatus.NOT_FOUND;
//   code: 4001;
//   result: '존재하지 않는 유저입니다.';
// };

export const UsersErrors = {};

// -----------------------------------------------------------------------------
// Policy 5000 ~ 5999
// -----------------------------------------------------------------------------
// export type POLICY_POLICY_NOT_FOUND = ErrorResponse & {
//   isSuccess: false;
//   status: HttpStatus.NOT_FOUND;
//   code: 5000;
//   result: '존재하지 않는 약관입니다.';
// };

export const PolicyErrors = {};

// -----------------------------------------------------------------------------
// Competitions 6000 ~ 6999
// -----------------------------------------------------------------------------
export type COMPETITIONS_COMPETITION_STATUS_CANNOT_BE_ACTIVE = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 6000;
  type: 'COMPETITIONS_COMPETITION_STATUS_CANNOT_BE_ACTIVE';
  result: '대회의 상태를 ACTIVE로 변경할 수 없습니다.';
};

export type COMPETITIONS_DIVISION_DUPLICATED = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.CONFLICT;
  code: 6001;
  type: 'COMPETITIONS_DIVISION_DUPLICATED';
  result: '대회 부문이 중복되었습니다.';
};

export type COMPETITIONS_REQUIRED_ADDITIONAL_INFO_DUPLICATED = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.CONFLICT;
  code: 6002;
  type: 'COMPETITIONS_REQUIRED_ADDITIONAL_INFO_DUPLICATED';
  result: '대회 추가 정보가 중복되었습니다.';
};

export type COMPETITIONS_COMPETITION_STATUS_NOT_ACTIVE = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 6003;
  type: 'COMPETITIONS_COMPETITION_STATUS_NOT_ACTIVE';
  result: '대회의 상태가 ACTIVE가 아닙니다.';
};

export const CompetitionsErrors = {
  COMPETITIONS_COMPETITION_STATUS_CANNOT_BE_ACTIVE: typia.random<COMPETITIONS_COMPETITION_STATUS_CANNOT_BE_ACTIVE>(),
  COMPETITIONS_DIVISION_DUPLICATED: typia.random<COMPETITIONS_DIVISION_DUPLICATED>(),
  COMPETITIONS_REQUIRED_ADDITIONAL_INFO_DUPLICATED: typia.random<COMPETITIONS_REQUIRED_ADDITIONAL_INFO_DUPLICATED>(),
  COMPETITIONS_COMPETITION_STATUS_NOT_ACTIVE: typia.random<COMPETITIONS_COMPETITION_STATUS_NOT_ACTIVE>(),
};

// -----------------------------------------------------------------------------
//  Applications 7000 ~ 7999
// -----------------------------------------------------------------------------
// todo!!! entity not found 로 처리할수 있는 에러 제거하기
export type APPLICATIONS_DIVISION_NOT_FOUND = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.NOT_FOUND;
  code: 7000;
  type: 'APPLICATIONS_DIVISION_NOT_FOUND';
  result: '신청 부문을 찾을 수 없습니다.';
};

export type APPLICATIONS_DIVISION_AGE_NOT_MATCH = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 7001;
  type: 'APPLICATIONS_DIVISION_AGE_NOT_MATCH';
  result: '선수의 나이와 신청 부문의 나이가 맞지 않습니다.';
};

export type APPLICATIONS_DIVISION_GENDER_NOT_MATCH = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 7002;
  type: 'APPLICATIONS_DIVISION_GENDER_NOT_MATCH';
  result: '선수의 성별과 신청 부문의 성별이 맞지 않습니다.';
};

// export type APPLICATIONS_REGISTRATION_NOT_STARTED = ErrorResponse & {
//   isSuccess: false;
//   status: HttpStatus.BAD_REQUEST;
//   code: 7003;
//   type: 'APPLICATIONS_REGISTRATION_NOT_STARTED';
//   result: '대회 신청 기간 이전입니다.';
// };

// export type APPLICATIONS_REGISTRATION_ENDED = ErrorResponse & {
//   isSuccess: false;
//   status: HttpStatus.BAD_REQUEST;
//   code: 7004;
//   type: 'APPLICATIONS_REGISTRATION_ENDED';
//   result: '대회 신청 기간이 종료되었습니다.';
// };

export type APPLICATIONS_PLAYER_SNAPSHOT_OR_DIVISION_INFO_REQUIRED = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 7005;
  type: 'APPLICATIONS_PLAYER_SNAPSHOT_OR_DIVISION_INFO_REQUIRED';
  result: 'PlayerSnapshotUpdateDto or ParticipationDivisionInfoUpdateDtos or AdditionalInfoUpdateDto must be provided.';
};

export type APPLICATIONS_SELF_APPLICATION_NOT_ALLOWED = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 7007;
  type: 'APPLICATIONS_SELF_APPLICATION_NOT_ALLOWED';
  result: '본인 신청의 경우 선수 정보와 사용자 정보가 일치해야 합니다';
};

export type APPLICATIONS_PARTICIPATION_DIVISION_INFO_NOT_FOUND = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.NOT_FOUND;
  code: 7008;
  type: 'APPLICATIONS_PARTICIPATION_DIVISION_INFO_NOT_FOUND';
  result: '변경하고자 하는 participationDivisionInfo가 존재하지 않습니다.';
};

export type APPLICATIONS_REQUIRED_ADDITIONAL_INFO_NOT_MATCH = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.NOT_FOUND;
  code: 7009;
  type: 'APPLICATIONS_REQUIRED_ADDITIONAL_INFO_NOT_FOUND';
  result: '대회 신청시 필요한 추가 정보가 존재하지 않습니다.';
};

export type APPLICATIONS_ADDITIONAL_INFO_NOT_FOUND = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.NOT_FOUND;
  code: 7010;
  type: 'APPLICATIONS_ADDITIONAL_INFO_NOT_FOUND';
  result: '수정하고자 하는 additionalInfo가 존재하지 않습니다.';
};

export type APPLICATIONS_ORDRE_PAYMENT_AMOUNT_NOT_MATCH = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 7011;
  type: 'APPLICATIONS_ORDRE_PAYMENT_AMOUNT_NOT_MATCH';
  result: '결제 금액이 일치하지 않습니다.';
};

// export type APPLICATIONS_REFUND_DEADLINE_ENDED = ErrorResponse & {
//   isSuccess: false;
//   status: HttpStatus.BAD_REQUEST;
//   code: 7012;
//   type: 'APPLICATIONS_REFUND_DEADLINE_ENDED';
//   result: '환불 기간이 종료되었습니다.';
// };

export type APPLICATIONS_STATUS_NOT_READY = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 7013;
  type: 'APPLICATIONS_STATUS_NOT_READY';
  result: '신청 상태가 READY가 아닙니다.';
};

export type APPLICATIONS_STATUS_NOT_DONE_OR_PARTIAL_CANCELED = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 7014;
  type: 'APPLICATIONS_STATUS_NOT_DONE_OR_PARTIAL_CANCELED';
  result: '신청 상태가 DONE이거나 PARTIAL_CANCELED가 아닙니다.';
};

export type APPLICATIONS_DIVISION_NOT_ACTIVE = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 7015;
  type: 'APPLICATIONS_DIVISION_NOT_ACTIVE';
  result: '대회 부문이 ACTIVE 상태가 아닙니다.';
};

export type APPLICATIONS_REGISTER_ZERO_COUNT_DIVISIONS_IN_SOLO_PERIOD = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 7016;
  type: 'APPLICATIONS_REGISTER_ZERO_COUNT_DIVISIONS_IN_SOLO_PERIOD';
  result: '단독 출전 조정 기간에는, 참가인원이 0명인 부문에 참가 신청할 수 없습니다.';
};

export type APPLICATIONS_CANCEL_NON_ZERO_COUNT_DIVISIONS_IN_SOLO_PERIOD = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 7017;
  type: 'APPLICATIONS_CANCEL_NON_ZERO_COUNT_DIVISIONS_IN_SOLO_PERIOD';
  result: '단독 출전 조정 기간에는, 참가인원이 본인 제외 0명인 부문만 취소할 수 있습니다.';
};

export type APPLICATIONS_REGISTERABLE_PERIOD = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 7018;
  type: 'APPLICATIONS_REGISTERABLE_PERIOD';
  result: '대회 신청 가능 기간이 아닙니다.';
};

export type APPLICATIONS_CANCELABLE_PERIOD = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 7019;
  type: 'APPLICATIONS_CANCELABLE_PERIOD';
  result: '대회 신청 취소 가능 기간이 아닙니다.';
};

export const ApplicationsErrors = {
  APPLICATIONS_DIVISION_NOT_FOUND: typia.random<APPLICATIONS_DIVISION_NOT_FOUND>(),
  APPLICATIONS_DIVISION_AGE_NOT_MATCH: typia.random<APPLICATIONS_DIVISION_AGE_NOT_MATCH>(),
  APPLICATIONS_DIVISION_GENDER_NOT_MATCH: typia.random<APPLICATIONS_DIVISION_GENDER_NOT_MATCH>(),
  // APPLICATIONS_REGISTRATION_NOT_STARTED: typia.random<APPLICATIONS_REGISTRATION_NOT_STARTED>(),
  // APPLICATIONS_REGISTRATION_ENDED: typia.random<APPLICATIONS_REGISTRATION_ENDED>(),
  APPLICATIONS_PLAYER_SNAPSHOT_OR_DIVISION_INFO_REQUIRED:
    typia.random<APPLICATIONS_PLAYER_SNAPSHOT_OR_DIVISION_INFO_REQUIRED>(),
  APPLICATIONS_SELF_APPLICATION_NOT_ALLOWED: typia.random<APPLICATIONS_SELF_APPLICATION_NOT_ALLOWED>(),
  APPLICATIONS_PARTICIPATION_DIVISION_INFO_NOT_FOUND:
    typia.random<APPLICATIONS_PARTICIPATION_DIVISION_INFO_NOT_FOUND>(),
  APPLICATIONS_REQUIRED_ADDITIONAL_INFO_NOT_MATCH: typia.random<APPLICATIONS_REQUIRED_ADDITIONAL_INFO_NOT_MATCH>(),
  APPLICATIONS_ADDITIONAL_INFO_NOT_FOUND: typia.random<APPLICATIONS_ADDITIONAL_INFO_NOT_FOUND>(),
  APPLICATIONS_ORDRE_PAYMENT_AMOUNT_NOT_MATCH: typia.random<APPLICATIONS_ORDRE_PAYMENT_AMOUNT_NOT_MATCH>(),
  // APPLICATIONS_REFUND_DEADLINE_ENDED: typia.random<APPLICATIONS_REFUND_DEADLINE_ENDED>(),
  APPLICATIONS_STATUS_NOT_READY: typia.random<APPLICATIONS_STATUS_NOT_READY>(),
  APPLICATIONS_STATUS_NOT_DONE_OR_PARTIAL_CANCELED: typia.random<APPLICATIONS_STATUS_NOT_DONE_OR_PARTIAL_CANCELED>(),
  APPLICATIONS_DIVISION_NOT_ACTIVE: typia.random<APPLICATIONS_DIVISION_NOT_ACTIVE>(),
  APPLICATIONS_REGISTER_ZERO_COUNT_DIVISIONS_IN_SOLO_PERIOD:
    typia.random<APPLICATIONS_REGISTER_ZERO_COUNT_DIVISIONS_IN_SOLO_PERIOD>(),
  APPLICATIONS_CANCEL_NON_ZERO_COUNT_DIVISIONS_IN_SOLO_PERIOD:
    typia.random<APPLICATIONS_CANCEL_NON_ZERO_COUNT_DIVISIONS_IN_SOLO_PERIOD>(),
  APPLICATIONS_REGISTERABLE_PERIOD: typia.random<APPLICATIONS_REGISTERABLE_PERIOD>(),
  APPLICATIONS_CANCELABLE_PERIOD: typia.random<APPLICATIONS_CANCELABLE_PERIOD>(),
};

// -----------------------------------------------------------------------------
// Posts 8000 ~ 8999
// -----------------------------------------------------------------------------
export type POSTS_POST_LIKE_ALREADY_EXIST = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.CONFLICT;
  code: 8000;
  type: 'POSTS_POST_LIKE_ALREADY_EXIST';
  result: '이미 좋아요를 누른 게시글입니다.';
};

export type POSTS_POST_REPORT_ALREADY_EXIST = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.CONFLICT;
  code: 8001;
  type: 'POSTS_POST_REPORT_ALREADY_EXIST';
  result: '이미 신고한 게시글입니다.';
};

export type POSTS_COMMENT_LIKE_ALREADY_EXIST = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.CONFLICT;
  code: 8002;
  type: 'POSTS_COMMENT_LIKE_ALREADY_EXIST';
  result: '이미 좋아요를 누른 댓글입니다.';
};

export type POSTS_COMMENT_REPORT_ALREADY_EXIST = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.CONFLICT;
  code: 8003;
  type: 'POSTS_COMMENT_REPORT_ALREADY_EXIST';
  result: '이미 신고한 댓글입니다.';
};

export type POSTS_COMMENT_REPLY_TO_REPLY_NOT_ALLOWED = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 8004;
  type: 'POSTS_COMMENT_REPLY_TO_REPLY_NOT_ALLOWED';
  result: '대댓글의 대댓글은 생성할 수 없습니다.';
};

export const PostsErrors = {
  POSTS_POST_LIKE_ALREADY_EXIST: typia.random<POSTS_POST_LIKE_ALREADY_EXIST>(),
  POSTS_POST_REPORT_ALREADY_EXIST: typia.random<POSTS_POST_REPORT_ALREADY_EXIST>(),
  POSTS_COMMENT_LIKE_ALREADY_EXIST: typia.random<POSTS_COMMENT_LIKE_ALREADY_EXIST>(),
  POSTS_COMMENT_REPORT_ALREADY_EXIST: typia.random<POSTS_COMMENT_REPORT_ALREADY_EXIST>(),
  POSTS_COMMENT_REPLY_TO_REPLY_NOT_ALLOWED: typia.random<POSTS_COMMENT_REPLY_TO_REPLY_NOT_ALLOWED>(),
};

// -----------------------------------------------------------------------------
// ViewCount 9000 ~ 9999
// -----------------------------------------------------------------------------
export type VIEW_COUNT_IVALID_ENTITY_TYPE = ErrorResponse & {
  isSuccess: false;
  status: HttpStatus.BAD_REQUEST;
  code: 9000;
  type: 'VIEW_COUNT_IVALID_ENTITY_TYPE';
  result: '유효하지 않은 entity type 입니다.';
};

export const ViewCountErrors = {
  VIEW_COUNT_IVALID_ENTITY_TYPE: typia.random<VIEW_COUNT_IVALID_ENTITY_TYPE>(),
};
