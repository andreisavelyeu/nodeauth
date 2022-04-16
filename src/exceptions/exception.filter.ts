import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ILogger } from '../services/logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IExceptionFilter } from './exception.filter.interface';
import { HTTPError } from './http-error.class';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {}
	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.loggerService.error(
				`[${err.context || 'error'}] with statusCode ${err.statusCode}: ${err.message}`,
			);
			res.status(err.statusCode).send({ err: err.message });
		} else {
			this.loggerService.error(`${err.message}`);
			res.status(500).send({ err: err.message });
		}
	}
}
