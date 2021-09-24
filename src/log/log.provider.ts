import { LoggingInterceptor } from './log.interceptor';
import { LogService } from './log.service';

export const logProviders = [LogService, LoggingInterceptor];
