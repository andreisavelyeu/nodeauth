import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IConfig } from './services/config/config.service.interface';
import { ILogger } from './services/logger/logger.interface';
import { TYPES } from './types';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IConfig) private config: IConfig,
	) {
		this.app = express();
		this.port = Number(this.config.get('PORT')) || 5000;
	}

	public async init(): Promise<void> {
		this.server = this.app.listen(this.port, () => {
			this.logger.log(`Server is running on port ${this.port}`);
		});
	}
}
