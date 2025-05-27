// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as nodemailer from 'nodemailer';
// @Injectable()
// export class MailService {
//   private transporter: nodemailer.Transporter;
//   constructor(private configService: ConfigService) {
//     // 创建一个Nodemailer transporter实例
//     this.transporter = nodemailer.createTransport({
//       host: configService.get<string>('EMAIL_HOST'), // smtp服务器地址
//       port: configService.get<number>('EMAIL_PORT'), // SMTP服务器端口
//       secure: configService.get<string>('EMAIL_SECURE'), // 使用 SSL
//       auth: {
//         user: configService.get<string>('EMAIL_USER'),
//         pass: configService.get<string>('EMAIL_PASS'), //授权码
//       },
//     });
//   }
//   async sendMail(email: string, html: string) {
//     const code = Math.random().toString().slice(-6);
//     const mailOptions: nodemailer.SendMailOptions = {
//       from: this.configService.get<string>('EMAIL_USER'),
//       to: email,
//       subject: '验证码',
//       html: `
//         <div style="font-family: Arial, sans-serif;">
//           <h2>${html}</h2>
//           <p>您的验证码是：<strong>${code}</strong></p>
//           <p style="color: #666;">有效期5分钟，请勿泄露给他人</p>
//         </div>
//       `,
//     };
//     console.log(`用户验证码为：${code}，有效期为5分钟，请及时使用!${html}`);
//     //发送邮件
//     return new Promise((reslove, reject) => [
//       this.transporter.sendMail(
//         mailOptions,
//         (error: Error, info: { envelopment: Record<string, string[]> }) => {
//           if (error) {
//             reject(
//               new HttpException(
//                 `发送邮件失败:${error}`,
//                 HttpStatus.INTERNAL_SERVER_ERROR,
//               ),
//             );
//           } else {
//             reslove({
//               code,
//               ...info.envelopment,
//             });
//           }
//         },
//       ),
//     ]);
//   }
// }
