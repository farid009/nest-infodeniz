import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { IEmailService } from './email.interface';

@Injectable()
export class SMTPEmailService implements IEmailService {
  constructor(private readonly mailerService: MailerService) {}

  async send(
    from: string,
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      from: from,
      to: to,
      subject: subject,
      html: html,
    });
  }
}

@Injectable()
export class EmailQueueService implements IEmailService {
  constructor(
    @InjectQueue('send_email')
    private sendEmailQueue: Queue,
  ) {}
  async send(
    from: string,
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    await this.sendEmailQueue.add(
      'send_email',
      {
        from,
        to,
        subject,
        html,
      },
      {
        removeOnComplete: true,
      },
    );
  }
}
