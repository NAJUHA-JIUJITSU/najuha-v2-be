import { HttpException, HttpStatus } from '@nestjs/common';

export interface ErrorResponse {
  result: boolean;
  status: HttpStatus;
  code: number;
  data: string;
  detail?: any;
}

export interface INTERNAL_SERVER_ERROR extends ErrorResponse {
  result: false;
  status: HttpStatus.INTERNAL_SERVER_ERROR;
  code: 500;
  data: 'Internal Server Error';
}

export class BusinessException extends HttpException {
  constructor(errorResponse: ErrorResponse, errorDetail?: string) {
    errorResponse.detail = errorDetail;
    super(errorResponse, errorResponse.status);
  }
}