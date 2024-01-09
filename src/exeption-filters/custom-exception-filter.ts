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
export class CoustomExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status: number;
    let responseBody: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      responseBody = exception.getResponse();
      this.logger.error(
        `${req.method} ${req.originalUrl} ${status} ${JSON.stringify(
          req.body,
        )} ${JSON.stringify(responseBody)}`,
      );
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      this.logger.error(
        `${req.method} ${req.originalUrl} ${status} ${JSON.stringify(
          req.body,
        )} ${JSON.stringify(exception)}`,
      );
      responseBody = typia.random<INTERNAL_SERVER_ERROR>();
    }

    res.status(status).json({
      ...responseBody,
    });
  }
}
