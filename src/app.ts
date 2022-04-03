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

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		await this.mongoService.connect();
		this.server = this.app.listen(this.port, () => {
			this.logger.log(`Server is running on port ${this.port}`);
		});
	}
}
