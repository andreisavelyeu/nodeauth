import { Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { ILogger } from '../../services/logger/logger.interface';
import { ExpressReturnType, IControllerRoute } from '../route.interface';
import { TYPES } from '../../types';

@injectable()
export class BaseController {
	private readonly _router: Router;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, statusCode: number, message: T): ExpressReturnType {
		res.type('application/json');
		return res.status(statusCode).send(message);
	}

	public created(res: Response): ExpressReturnType {
		return res.sendStatus(201);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);
			const middleware = route.middlewares?.map((middleware) => middleware.run.bind(middleware));
			const handler = route.func.bind(this);
			const pipeline = middleware ? [...middleware, handler] : handler;
			this.router[route.method](route.path, pipeline);
		}
	}
}
