import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl, body } = request;

    const userAgent = request.get('user-agent') || ''; // header에서 가져옴

    // 응답이 끝났을 때
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        'info',
        `${method} ${originalUrl} - ${statusCode} ${contentLength} | User-Agent: ${userAgent} | IP: ${ip} | Body: ${JSON.stringify(
          body,
        )}`,
      );
    });

    next();
  }
}
