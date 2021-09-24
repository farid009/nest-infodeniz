import { Module } from '@nestjs/common';
import { PrismaModule } from '../shared/modules/prisma-management/prisma.module';
import { fileStorageProviders } from './file-storage.provider';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: fileStorageProviders,
  exports: fileStorageProviders,
})
export class FileStorageModule {}
