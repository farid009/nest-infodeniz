import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AuthorizationModule } from '@src/authorization/authorization.module';
import { EmailModule } from '@src/email-management/email.module';
import { FileStorageModule } from '@src/file-storage/file-storage.module';
import { generateFileName } from '@src/shared/helpers/multer';
import { PrismaModule } from '@src/shared/modules/prisma-management/prisma.module';
import { diskStorage } from 'multer';
import { join } from 'path';
import { UserController } from './user.controller';
import { userProviders } from './user.provider';

@Module({
  imports: [
    PrismaModule,
    FileStorageModule,
    EmailModule,
    AuthorizationModule.register({
      userIdFromContext: (ctx) => {
        const request = ctx.switchToHttp().getRequest();

        return request.user && request.user.userId;
      },
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          limits: { fileSize: 1000000 },
          storage: diskStorage({
            destination: join(
              configService.get('fileStorage.baseUploadPath'),
              'files',
            ),
            filename: generateFileName(),
          }),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: userProviders,
  controllers: [UserController],
  exports: userProviders,
})
export class UserModule {}
