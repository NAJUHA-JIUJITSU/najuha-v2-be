import { HttpStatus } from '@nestjs/common';
import { ErrorResponse } from 'src/common/response/errorResponse';
import typia from 'typia';

export interface SNS_AUTH_KAKAO_LOGIN_ERROR extends ErrorResponse {
  result: false;
  status: HttpStatus.BAD_REQUEST;
  code: 6001;
  data: '카카오 로그인에 실패했습니다.';
}

export const SnsAuthErrorMap = {
  SNS_AUTH_KAKAO_LOGIN_ERROR: typia.random<SNS_AUTH_KAKAO_LOGIN_ERROR>(),
};
