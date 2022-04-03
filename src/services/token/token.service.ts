import jwt from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ILogger } from '../logger/logger.interface';
import { ITokenService } from './token.service.interface';
import TokenModel from '../../models/token/token.model';
import { IConfig } from '../config/config.service.interface';

@injectable()
export class TokenService implements ITokenService {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IConfig) private configService: IConfig,
	) {}

	generateTokens(payload: { email: string; isActivated: boolean; id: string }): {
		accessToken: string;
		refreshToken: string;
	} {
		const accessToken = jwt.sign(payload, this.configService.get('JWT_ACCESS_SECRET'), {
			expiresIn: '30m',
		});
		const refreshToken = jwt.sign(payload, this.configService.get('JWT_REFRESH_SECRET'), {
			expiresIn: '30d',
		});
		this.loggerService.log(
			`[TokenService]: tokens for ${payload.email} have been generated successfully`,
		);
		return { accessToken, refreshToken };
	}

	async saveToken(userId: string, refreshToken: string): Promise<string> {
		const tokenData = await TokenModel.findOne({ user: userId });

		if (tokenData) {
			tokenData.refreshToken = refreshToken;
			return tokenData.save();
		}

		const token = await TokenModel.create({ user: userId, refreshToken });
		return token;
	}
}
