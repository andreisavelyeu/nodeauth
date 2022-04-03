import { inject, injectable } from 'inversify';
import nodemailer from 'nodemailer';
import { TYPES } from '../../types';
import { IConfig } from '../config/config.service.interface';
import { ILogger } from '../logger/logger.interface';
import { IMailService } from './mail.service.interface';

@injectable()
export class MailService implements IMailService {
	private transporter;

	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IConfig) private configService: IConfig,
	) {
		this.transporter = nodemailer.createTransport({
			host: this.configService.get('SMTP_HOST'),
			port: +this.configService.get('SMTP_PORT'),
			secure: false,
			auth: {
				user: this.configService.get('SMTP_USER'),
				pass: this.configService.get('SMTP_PASSWORD'),
			},
		});
	}

	async sendActivationMail(email: string, link: string): Promise<void> {
		try {
			await this.transporter.sendMail({
				from: this.configService.get('SMTP_USER'),
				to: email,
				text: '',
				subject: `Account activation on ${this.configService.get('API_URL')}`,
				html: `<div>
                    <h1>To activate your account follow the link</h1>
                    <a href="${link}">${link}</a>
                </div>`,
			});
			this.loggerService.log(`[MailService] mail has been sent successfully`);
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error(`[MailService] error while sending email: ${e.message}`);
			}
		}
	}
}
