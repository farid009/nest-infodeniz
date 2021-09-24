import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import configuration from '@src/configs';
import { AuthenticationModule } from './authentication/authentication.module';
import { getEnvFilePath } from './shared/helpers';
import { TokenModule } from './shared/modules/token/token.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePath(),
      load: [configuration],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): RedisModuleOptions => {
        const redisConfigs = configService.get('redisDb');

        return { config: { host: redisConfigs.host, port: redisConfigs.port } };
      },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisConfigs = configService.get('redisDb');

        return {
          redis: redisConfigs,
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return [
          {
            rootPath: configService.get('constants.staticFilesPath'),
            renderPath: 'public',
          },
        ];
      },
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const mailserverConfigs = configService.get('mailServer');

        return {
          transport: {
            host: mailserverConfigs.host,
            port: parseInt(mailserverConfigs.port),
            tls: {
              rejectUnauthorized: false,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    TokenModule,
    UserModule,
    AuthenticationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
