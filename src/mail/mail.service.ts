import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get<string>('EMAIL_HOST'),
      port: Number(configService.get<string>('EMAIL_PORT')),
      secure: configService.get<string>('EMAIL_SECURE') === 'true',
      auth: {
        user: configService.get<string>('EMAIL_USER'),
        pass: configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  /**
   * 发送邮件
   *
   * @param email 收件人邮箱
   * @param subject 邮件主题
   * @param html 邮件正文，可选
   * @returns 返回一个 Promise 对象，解析后得到一个包含验证码和邮件信封信息的对象
   * @throws HttpException 当邮件发送失败时，会抛出一个 HttpException 异常
   */
  sendMail(
    email: string,
    subject: string,
    html?: string,
  ): Promise<Record<string, string>> {
    const code = Math.random().toString().slice(-6);
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: email,
      subject,
      html: `
              <div style="font-family: Arial, sans-serif;">
                <h2>${html}</h2>
                <p>您的验证码是：<strong>${code}</strong></p>
                <p style="color: #666;">有效期5分钟，请勿泄露给他人</p>
              </div>
            `,
    };
    console.log(`用户验证码为：${code}，有效期为5分钟，请及时使用!`);
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(
        mailOptions,
        (error: Error, info: { envelope: Record<string, string[]> }) => {
          if (error) {
            reject(
              new HttpException(
                `发送邮件失败:${error}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
            );
          } else {
            resolve({
              code,
              ...info.envelope,
            });
          }
        },
      );
    });
  }
}
