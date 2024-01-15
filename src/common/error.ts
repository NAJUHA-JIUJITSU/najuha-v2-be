import { HttpException, HttpStatus } from '@nestjs/common';
import typia from 'typia';

export interface ErrorForm {
  result: boolean;
  status: HttpStatus;
  code: number;
  data: string;
}

export interface KAKAO_USER_INFO_ERROR extends ErrorForm {
  result: false;
  status: HttpStatus.INTERNAL_SERVER_ERROR; // Choose an appropriate status code
  code: 5001; // Choose a unique code for this error
  data: '카카오 사용자 정보를 가져오는 중 오류가 발생했습니다.';
}

export interface NOT_FOUND_USER extends ErrorForm {
  result: false;
  status: HttpStatus.NOT_FOUND;
  code: 4001;
  data: '존재하지 않는 유저입니다.';
}

export interface EXIST_USER extends ErrorForm {
  result: false;
  status: HttpStatus.BAD_REQUEST;
  code: 4002;
  data: '이미 존재하는 유저입니다.';
}

export interface INTERNAL_SERVER_ERROR extends ErrorForm {
  result: false;
  status: HttpStatus.INTERNAL_SERVER_ERROR;
  code: 500;
  data: 'Internal Server Error';
}

const errorMap = {
  NOT_FOUND_USER: typia.random<NOT_FOUND_USER>(),
  EXIST_USER: typia.random<EXIST_USER>(),
  INTERNAL_SERVER_ERROR: typia.random<INTERNAL_SERVER_ERROR>(),
  KAKAO_USER_INFO_ERROR: typia.random<KAKAO_USER_INFO_ERROR>(),
};

// TODO: custorm Exception 만들기?, 내가 만든 에러가 아닌 경우에 htptException 사용 할수도 있나?
export class ExpectedError extends HttpException {
  constructor(exceptionType: keyof typeof errorMap) {
    super(errorMap[exceptionType], errorMap[exceptionType].status);
  }
}
