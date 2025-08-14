import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response: unknown) => {
        if (!response) return { data: [] };
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          'meta' in response
        )
          return {
            data: response.data,
            meta: response.meta,
          };
        return { data: response };
      }),
    );
  }
}
