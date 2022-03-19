import { config, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../../types';
import { IConfig } from './config.service.interface';
import 'reflect-metadata';

@injectable()
export class ConfigService implements IConfig {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const result = config();
		if (result.error) {
			logger.error('[ConfigService]: error while loading .env');
		}
		this.logger.log('[ConfigService]: loaded successfully');
		this.config = result.parsed as DotenvParseOutput;
	}

	public get(key: string): string {
		return this.config[key];
	}
}
