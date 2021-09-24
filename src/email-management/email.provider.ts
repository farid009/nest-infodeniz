import { EmailConsumer } from './email.processor';
import { EmailQueueService, SMTPEmailService } from './email.service';
export const emailManagementProviders = [
  SMTPEmailService,
  EmailConsumer,
  EmailQueueService,
];
