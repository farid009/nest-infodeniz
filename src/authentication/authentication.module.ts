import { Module } from '@nestjs/common';
import { AuthorizationModule } from '@src/authorization/authorization.module';
import { LogModule } from '@src/log/log.module';
import { UserModule } from '@src/user/user.module';
import { AuthenticationController } from './authentication.controller';
import { authenticateProviders } from './authentication.provider';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [
    UserModule,
    LogModule,
    AuthorizationModule.register({
      userIdFromContext: (ctx) => {
        const request = ctx.switchToHttp().getRequest();

        return request.user && request.user.userId;
      },
    }),
  ],
  controllers: [AuthenticationController],
  providers: authenticateProviders,
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
