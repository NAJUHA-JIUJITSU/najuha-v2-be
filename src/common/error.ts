import { HttpException, HttpStatus } from '@nestjs/common';

export interface ERROR {
  result: boolean;
  status: HttpStatus;
  code: number;
  data: string;
}

export interface NOT_FOUND_USER extends ERROR {
  result: false;
  status: HttpStatus.NOT_FOUND;
  code: 4001;
  data: '존재하지 않는 유저입니다.';
}

export interface EXIST_USER extends ERROR {
  result: false;
  status: HttpStatus.BAD_REQUEST;
  code: 4002;
  data: '이미 존재하는 유저입니다.';
}

export interface INTERNAL_SERVER_ERROR extends ERROR {
  result: false;
  status: HttpStatus.INTERNAL_SERVER_ERROR;
  code: 500;
  data: 'Internal Server Error';
}

export class HttpExceptionFactory {
  static create<T extends ERROR>(error: T): HttpException {
    return new HttpException(error, error.status);
  }
}
