import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  BusinessException,
  INTERNAL_SERVER_ERROR,
} from '../response/errorResponse';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import typia from 'typia';

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
      error: {
        message: exception.message,
        name: exception.name,
        stack: exception.stack,
      },
      path: req.path,
      requestBody: req.body,
    };

    if (exception instanceof BusinessException) {
      status = exception.getStatus();
      responseBody = exception.getResponse();
      errorInfo['responseBody'] = responseBody;
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
