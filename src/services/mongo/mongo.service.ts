import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ILogger } from '../logger/logger.interface';
import 'reflect-metadata';
import mongoose from 'mongoose';
import { IConfig } from '../config/config.service.interface';
import { IMongoService } from './mongo.service.interface';

@injectable()
export class MongoService implements IMongoService {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IConfig) private configService: IConfig,
	) {}

	async connect(): Promise<void> {
		try {
			await mongoose.connect(this.configService.get('DB_URL'));
			this.loggerService.log('[MongoService] connected successfully');
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error('[MongoService] failed to connect', e.message);
			}
		}
	}

	async disconnect(): Promise<void> {
		await mongoose.connection.close();
	}
}
