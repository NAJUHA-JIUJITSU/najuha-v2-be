import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
// import { Request, Response } from 'express';
import { Response } from 'express';
import { INTERNAL_SERVER_ERROR } from './error';
import typia from 'typia';
// import { WinstonLogger } from './winston-logger.service'; // Winston 로거 서비스를 임포트합니다.

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    let status: number;
    let responseBody: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      responseBody = exception.getResponse();
      console.log(
        `[${new Date().toISOString()}] ${JSON.stringify(responseBody)}`,
      );
    } else {
      // 로깅 로직을 여기에 구현합니다.
      // console.log 로 임시로 구현
      console.log(`[${new Date().toISOString()}] ${JSON.stringify(exception)}`);

      status = 500;
      responseBody = typia.random<INTERNAL_SERVER_ERROR>();
    }

    response.status(status).json({
      ...responseBody,
      //   timestamp: new Date().toISOString(),
      //   path: request.url,
    });
  }
}

// import {
//   ExceptionFilter,
//   Catch,
//   ArgumentsHost,
//   HttpException,
// } from '@nestjs/common';
// import { Response } from 'express';
// import { INTERNAL_SERVER_ERROR } from './error';
// import typia from 'typia';
// import { WinstonLogger } from './winston-logger.service';

// @Catch()
// export class HttpErrorFilter implements ExceptionFilter {
//   constructor(private readonly logger: WinstonLogger) {} // 로거 주입

//   catch(exception: unknown, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();

//     let status: number;
//     let responseBody: any;

//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       responseBody = exception.getResponse();

//       this.logger.error('HttpException 발생', {
//         timestamp: new Date().toISOString(),
//         status,
//         error: responseBody,
//       });
//     } else {
//       // 예상치 못한 에러 로깅
//       this.logger.error('예상치 못한 에러 발생', {
//         timestamp: new Date().toISOString(),
//         error: exception,
//       });

//       status = 500;
//       responseBody = typia.random<INTERNAL_SERVER_ERROR>();
//     }

//     response.status(status).json({
//       ...responseBody,
//     });
//   }
// }
