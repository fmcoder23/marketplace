import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailHelper {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get("mail.host"), 
      port: +this.configService.get("mail.port"),
      secure: false,
      auth: {
        user: this.configService.get("mail.user"), 
        pass: this.configService.get("mail.pass"),
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html: string) {
    const result = await this.transporter.sendMail({
      from: '"Fozil MarketPlace" <no-reply@fozilmarketplace.com>',
      to,
      subject,
      text,
      html,
    });
    console.log(`Message sent: ${result.messageId}`);
    return result;
  }
}
