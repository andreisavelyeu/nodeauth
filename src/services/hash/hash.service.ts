import { inject, injectable } from 'inversify';
import bcrypt from 'bcrypt';
import 'reflect-metadata';
import { IHashService } from './hash.service.interface';
import { TYPES } from '../../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class HashService implements IHashService {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {}

	async hashPassword(password: string): Promise<string | undefined> {
		try {
			const hash = await bcrypt.hash(password, 3);
			this.loggerService.log(`[HashService]: password has been hashed successfully`);
			return hash;
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error(`[HashService]: error while trying to hash password ${e.message}`);
			}
		}
	}

	async compare(password: string, existUserPassword: string): Promise<boolean> {
		return await bcrypt.compare(password, existUserPassword);
	}
}
