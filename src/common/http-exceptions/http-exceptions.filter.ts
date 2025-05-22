import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { Logger } from 'src/common/logger/logger';
import { Request, Response } from 'express';
@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  @Inject(Logger)
  private loggger: Logger;
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as { message?: string };
    const logFormat = `
##############################################################################################################
Request original url: ${request.originalUrl}
Method: ${request.method}
IP: ${request.ip}
Status code: ${status}
Response: ${exception.message}（${exceptionResponse?.message || exception.message}）
##############################################################################################################
`;
    this.loggger.error(logFormat, 'HttpException filter ');
    response.status(status).json({
      code: status,
      success: false,
      message: exceptionResponse?.message || exception.message,
      type: `${Number(status) >= Number(HttpStatus.INTERNAL_SERVER_ERROR) ? 'Service Error' : 'Client Error'}`,
    });
  }
}
