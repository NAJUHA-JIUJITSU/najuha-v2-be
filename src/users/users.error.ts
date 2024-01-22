import { HttpStatus } from '@nestjs/common';
import { ErrorResponse } from 'src/common/response/errorResponse';
import typia from 'typia';

export interface USERS_NOT_FOUND_ERROR extends ErrorResponse {
  result: false;
  status: HttpStatus.NOT_FOUND;
  code: 5001;
  data: '존재하지 않는 유저입니다.';
}

export const UsersErrorMap = {
  USERS_NOT_FOUND_ERROR: typia.random<USERS_NOT_FOUND_ERROR>(),
};
