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

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{ path: '/login', method: 'post', func: this.login },
		]);
	}

	login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		// TODO handle authentication
	}

	register({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): void {
		// TODO handle registration
	}
}
