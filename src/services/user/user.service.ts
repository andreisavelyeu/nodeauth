import { inject, injectable } from 'inversify';
import { v4 } from 'uuid';
import { TYPES } from '../../types';
import { ILogger } from '../logger/logger.interface';
import { IUserService, UserAndTokens } from './user.service.interface';
import 'reflect-metadata';
import UserModel from '../../models/user/user.model';
import { IHashService } from '../hash/hash.service.interface';
import { IMailService } from '../mail/mail.service.interface';
import { ITokenService } from '../token/token.service.interface';
import { UserEntity } from './user.entity';
import { IConfig } from '../config/config.service.interface';
import { HTTPError } from '../../exceptions/http-error.class';
import { JwtPayload } from 'jsonwebtoken';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IHashService) private hashService: IHashService,
		@inject(TYPES.IMailService) private mailService: IMailService,
		@inject(TYPES.ITokenService) private tokenService: ITokenService,
		@inject(TYPES.IConfig) private configService: IConfig,
	) {}

	async login(email: string, password: string): Promise<UserAndTokens> {
		const user = await UserModel.findOne({ email });
		if (!user) {
			throw new HTTPError(`Incorrect email or password`, 401, 'UserService');
		}

		const isPasswordCorrect = await this.hashService.compare(password, user.password);

		if (!isPasswordCorrect) {
			throw new HTTPError(`Incorrect email or password`, 401, 'UserService');
		}

		const userEntity = new UserEntity(user);
		const tokens = this.tokenService.generateTokens({ ...userEntity });
		await this.tokenService.saveToken(userEntity.id, tokens.refreshToken);

		return {
			...tokens,
			user: userEntity,
		};
	}

	async logout(refreshToken: string): Promise<void> {
		await this.tokenService.removeToken(refreshToken);
	}

	async register(email: string, password: string): Promise<UserAndTokens> {
		const registeredUser = await UserModel.findOne({ email });

		if (registeredUser) {
			throw new HTTPError(`User with the ${email} is already registered`, 409, 'UserService');
		}

		const hashedPassword = await this.hashService.hashPassword(password);
		const activationLink = v4();
		const newUser = await UserModel.create({ email, password: hashedPassword, activationLink });
		await this.mailService.sendActivationMail(
			email,
			`${this.configService.get('API_URL')}/users/activate/${activationLink}`,
		);
		const userEntity = new UserEntity(newUser);
		const tokens = this.tokenService.generateTokens({ ...userEntity });
		await this.tokenService.saveToken(userEntity.id, tokens.refreshToken);

		return {
			...tokens,
			user: userEntity,
		};
	}

	async activate(activationLink: string): Promise<void> {
		const user = await UserModel.findOne({ activationLink });

		if (!user) {
			throw new HTTPError('Activation link is incorrect', 400, 'UserService activation link');
		}

		user.isActivated = true;
		await user.save();
		this.loggerService.log(`[UserService] account has been activated successfully`);
	}

	async refreshToken(refreshToken: string): Promise<UserAndTokens> {
		if (!refreshToken) {
			throw new HTTPError(
				'You are not authorized to see this page',
				401,
				'UserService refresh token',
			);
		}

		const tokenData = this.tokenService.validateRefreshToken(refreshToken);
		const tokenDataDb = await this.tokenService.findRefreshToken(refreshToken);

		if (!tokenData || !tokenDataDb) {
			throw new HTTPError(
				'You are not authorized to see this page',
				401,
				'UserService refresh token',
			);
		}

		const user = await UserModel.findById((tokenData as JwtPayload).id);

		if (!user) {
			throw new HTTPError(
				'You are not authorized to see this page',
				401,
				'UserService refresh token',
			);
		}

		const userEntity = new UserEntity(user);

		const tokens = this.tokenService.generateTokens({ ...userEntity });
		await this.tokenService.saveToken(userEntity.id, tokens.refreshToken);

		return {
			...tokens,
			user: userEntity,
		};
	}

	async getAllUsers(): Promise<UserEntity[]> {
		const users = await UserModel.find();
		const userEntities = users.map((user) => new UserEntity(user));
		return userEntities;
	}
}
