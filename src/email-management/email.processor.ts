import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { SMTPEmailService } from './email.service';

@Injectable()
@Processor('send_email')
export class EmailConsumer {
  constructor(private emailService: SMTPEmailService) {}

  @Process('send_email')
  async processSendEmail(
    job: Job<{
      from: string;
      to: string;
      subject: string;
      html: string;
    }>,
  ): Promise<void> {
    const { from, to, subject, html } = job.data;

    await this.emailService.send(from, to, subject, html);
  }
}
