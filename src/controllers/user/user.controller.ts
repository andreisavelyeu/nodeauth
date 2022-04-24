import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { ILogger } from '../../services/logger/logger.interface';
import { TYPES } from '../../types';
import 'reflect-metadata';
import { BaseController } from '../base/base.controller';
import { IUserController } from './user.controller.interface';
import { ValidateMiddleware } from '../../middlewares/validate/validate.middleware';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { IUserService } from '../../services/user/user.service.interface';
import { IConfig } from '../../services/config/config.service.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IUserService) private userService: IUserService,
		@inject(TYPES.IConfig) private configService: IConfig,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{ path: '/login', method: 'post', func: this.login },
			{ path: '/logout', method: 'post', func: this.logout },
			{ path: '/users', method: 'get', func: this.getUsers },
			{ path: '/activate/:link', method: 'get', func: this.activate },
			{ path: '/refresh-token', method: 'get', func: this.refreshToken },
		]);
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const { email, password } = body;

		try {
			const user = await this.userService.login(email, password);
			res.cookie('refreshToken', user.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});
			this.send(res, 200, user);
		} catch (e) {
			next(e);
		}
	}

	logout({ cookies }: Request, res: Response, next: NextFunction): void {
		const { refreshToken } = cookies;

		try {
			this.userService.logout(refreshToken);
			res.clearCookie('refreshToken');
			this.send(res, 200, '');
		} catch (e) {
			next(e);
		}
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const { email, password } = body;

		try {
			const user = await this.userService.register(email, password);
			res.cookie('refreshToken', user.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});
			this.send(res, 201, user);
		} catch (e) {
			next(e);
		}
	}

	async activate(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { link } = req.params;
		try {
			await this.userService.activate(link);
			res.redirect(this.configService.get('CLIENT_APP_URL'));
		} catch (e) {
			next(e);
		}
	}

	async refreshToken({ cookies }: Request, res: Response, next: NextFunction): Promise<void> {
		const { refreshToken } = cookies;
		try {
			const user = await this.userService.refreshToken(refreshToken);
			res.cookie('refreshToken', user.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});
			this.send(res, 200, user);
		} catch (e) {
			next(e);
		}
	}

	getUsers({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): void {
		this.send(res, 200, { hello: 'hello' });
	}
}
