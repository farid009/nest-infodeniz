import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { LogService } from './log.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logService: LogService) {}
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const req: Request = context.switchToHttp().getRequest();
    const ip = <string>(
      (req.headers['x-forwarded-for'] || req.socket.remoteAddress)
    );
    const { method, url, body, headers } = req;

    this.logService.add({
      ip,
      context: { method, url, body, headers },
    });
    return next.handle();
  }
}
