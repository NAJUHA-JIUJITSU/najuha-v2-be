interface ResponseForm<T> {
  result: boolean;
  code: number;
  data: T;
}

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ResponseForm<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseForm<T>> {
    return next.handle().pipe(
      map((data) => {
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        return {
          result: true,
          code: 1000,
          data,
        };
      }),
    );
  }
}

@Injectable()
export class SimpleInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        console.log('SimpleInterceptor', data);
        return data;
      }), // 데이터를 그대로 반환
    );
  }
}
