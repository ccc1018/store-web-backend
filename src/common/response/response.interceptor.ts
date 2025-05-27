import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Logger } from '../logger/logger';
import { Request, Response } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{
    code: number;
    data: unknown;
    success: boolean;
  }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const req = context.getArgByIndex(1).req as Request;
    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data: unknown) => {
        const logFormat = `
###############################################################################################
      Request original url:${req.originalUrl}
      Mothod:${req.method}
      IP:${req.ip}
      Response: data : ${typeof data === 'object' && data !== null && 'socket' in data ? null : JSON.stringify(data)}
###############################################################################################
      `;
        this.logger.info(logFormat, 'Response  ResponseInterceptor');
        return {
          code: res.statusCode || 200,
          data,
          success: true,
        };
      }),
    );
  }
}
