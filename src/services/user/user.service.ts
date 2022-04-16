import { inject, injectable } from 'inversify';
import { v4 } from 'uuid';
import { TYPES } from '../../types';
import { ILogger } from '../logger/logger.interface';
import { IUserService, Registration } from './user.service.interface';
import 'reflect-metadata';
import UserModel from '../../models/user/user.model';
import { IHashService } from '../hash/hash.service.interface';
import { IMailService } from '../mail/mail.service.interface';
import { ITokenService } from '../token/token.service.interface';
import { UserEntity } from './user.entity';
import { IConfig } from '../config/config.service.interface';
import { HTTPError } from '../../exceptions/http-error.class';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IHashService) private hashService: IHashService,
		@inject(TYPES.IMailService) private mailService: IMailService,
		@inject(TYPES.ITokenService) private tokenService: ITokenService,
		@inject(TYPES.IConfig) private configService: IConfig,
	) {}

	async register(email: string, password: string): Promise<Registration> {
		const registeredUser = await UserModel.findOne({ email });

		if (registeredUser) {
			throw new HTTPError(`User with the ${email} is already registered`, 409, 'UserService');
		}

		const hashedPassword = await this.hashService.hashPassword(password);
		const activationLink = v4();
		const newUser = await UserModel.create({ email, password: hashedPassword, activationLink });
		await this.mailService.sendActivationMail(
			email,
			`${this.configService.get('API_URL')}/user/activate/${activationLink}`,
		);
		const userEntity = new UserEntity(newUser);
		const tokens = this.tokenService.generateTokens({ ...userEntity });
		await this.tokenService.saveToken(userEntity.id, tokens.refreshToken);

		return {
			...tokens,
			user: userEntity,
		};
	}
}
