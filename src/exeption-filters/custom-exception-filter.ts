import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR } from '../common/error';
import typia from 'typia';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status: number;
    let responseBody: any;

    const errorInfo = {
      requestBody: req.body,
      error: {
        message: exception.message,
        name: exception.name,
        stack: exception.stack,
      },
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      responseBody = exception.getResponse();
      this.logger.error('Http Exception', errorInfo);
    } else {
      this.logger.error('Internal Server Error', errorInfo);
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody = typia.random<INTERNAL_SERVER_ERROR>();
    }

    res.status(status).json({
      ...responseBody,
    });
  }
}
