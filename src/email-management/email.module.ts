import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { emailManagementProviders } from './email.provider';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'send_email',
    }),
  ],
  providers: emailManagementProviders,
  exports: emailManagementProviders,
})
export class EmailModule {}
