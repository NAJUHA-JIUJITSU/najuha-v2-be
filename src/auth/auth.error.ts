import { HttpStatus } from '@nestjs/common';
import { ErrorResponse } from 'src/response/errorResponse';
import typia from 'typia';

export interface AUTH_ERROR extends ErrorResponse {
  result: false;
  status: HttpStatus.NOT_FOUND;
  code: 4001;
  data: '존재하지 않는 유저입니다.';
}

export const AuthErrorMap = {
  AUTH_NOT_FOUND_ERROR: typia.random<AUTH_ERROR>(),
};
