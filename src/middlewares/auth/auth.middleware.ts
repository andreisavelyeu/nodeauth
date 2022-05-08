import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from '../middleware.interface';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ITokenService } from '../../services/token/token.service.interface';
import { JwtPayload } from 'jsonwebtoken';

@injectable()
export class AuthMiddleware implements IMiddleware {
	constructor(@inject(TYPES.ITokenService) private tokenService: ITokenService) {}

	async run(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { authorization } = req.headers;

		if (authorization) {
			const token = authorization.split(' ')[1];
			const userData = this.tokenService.validateAccessToken(token);
			if (userData) {
				req.user = (userData as JwtPayload).email;
				return next();
			}
		}
		next();
	}
}
