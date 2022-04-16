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

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IUserService) private userService: IUserService,
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

	login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		// TODO handle authentication
	}

	logout({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): void {
		// TODO handle logout
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

	activate({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): void {
		// TODO handle registration activation
	}

	refreshToken(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): void {
		// TODO handle refreshToken
	}

	getUsers({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): void {
		this.send(res, 200, { hello: 'hello' });
	}
}
