import { HttpStatus } from '@nestjs/common';
import { ErrorResponse } from 'src/common/response/errorResponse';
import typia from 'typia';

export interface AUTH_REFRESH_TOKEN_NOT_FOUND extends ErrorResponse {
  result: false;
  status: HttpStatus.UNAUTHORIZED;
  code: 4001;
  data: '존재하지 않는 리프레시 토큰입니다.';
}

export const AuthErrorMap = {
  AUTH_REFRESH_TOKEN_NOT_FOUND: typia.random<AUTH_REFRESH_TOKEN_NOT_FOUND>(),
};
