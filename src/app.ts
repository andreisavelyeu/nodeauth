import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import { json } from 'body-parser';
import { Server } from 'http';
import cors from 'cors';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { UserController } from './controllers/user/user.controller';
import { IConfig } from './services/config/config.service.interface';
import { ILogger } from './services/logger/logger.interface';
import { TYPES } from './types';
import { MongoService } from './services/mongo/mongo.service';
import { IExceptionFilter } from './exceptions/exception.filter.interface';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IConfig) private config: IConfig,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.IMongoService) private mongoService: MongoService,
		@inject(TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter,
	) {
		this.app = express();
		this.port = Number(this.config.get('PORT')) || 5000;
	}

	useMiddleware(): void {
		this.app.use(json());
		this.app.use(cookieParser());
		this.app.use(cors());
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExceptionFilter(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilter();
		await this.mongoService.connect();
		this.server = this.app.listen(this.port, () => {
			this.logger.log(`Server is running on port ${this.port}`);
		});
	}
}
