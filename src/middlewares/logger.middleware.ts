import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl, body } = request;

    const userAgent = request.get('user-agent') || ''; // header에서 가져옴

    // 응답이 끝났을 때
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      // 보기 편한 형태로 로그 메시지 만들기
      const logMessage = `${method} ${originalUrl} - ${statusCode} ${contentLength} | User-Agent: ${userAgent} | IP: ${ip} | Body: ${JSON.stringify(body)}`;

      // 색과 서식을 추가하여 가독성 향상
      this.logger.log('info', '\x1b[36m%s\x1b[0m', logMessage);

      // this.logger.log(
      //   'info',
      //   `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} ${JSON.stringify(
      //     body,
      //   )}`,
      // );

    });

    next();
  }
}
