import { Module } from '@nestjs/common';
import { PrismaModule } from '../shared/modules/prisma-management/prisma.module';
import { logProviders } from './log.provider';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: logProviders,
  exports: logProviders,
})
export class LogModule {}
