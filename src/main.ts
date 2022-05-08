import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { UserController } from './controllers/user/user.controller';
import { IUserController } from './controllers/user/user.controller.interface';
import { ExceptionFilter } from './exceptions/exception.filter';
import { IExceptionFilter } from './exceptions/exception.filter.interface';
import { AuthMiddleware } from './middlewares/auth/auth.middleware';
import { ConfigService } from './services/config/config.service';
import { IConfig } from './services/config/config.service.interface';
import { HashService } from './services/hash/hash.service';
import { IHashService } from './services/hash/hash.service.interface';
import { ILogger } from './services/logger/logger.interface';
import { LoggerService } from './services/logger/logger.service';
import { MailService } from './services/mail/mail.service';
import { IMailService } from './services/mail/mail.service.interface';
import { MongoService } from './services/mongo/mongo.service';
import { TokenService } from './services/token/token.service';
import { ITokenService } from './services/token/token.service.interface';
import { UserService } from './services/user/user.service';
import { IUserService } from './services/user/user.service.interface';
import { TYPES } from './types';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IConfig>(TYPES.IConfig).to(ConfigService).inSingletonScope();
	bind<MongoService>(TYPES.IMongoService).to(MongoService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.IExceptionFilter).to(ExceptionFilter);
	bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);
	bind<IHashService>(TYPES.IHashService).to(HashService);
	bind<IMailService>(TYPES.IMailService).to(MailService);
	bind<ITokenService>(TYPES.ITokenService).to(TokenService);
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService>(TYPES.IUserService).to(UserService);
	bind<App>(TYPES.Application).to(App);
});

const bootstrap = async (): Promise<void> => {
	const container = new Container();
	container.load(appBindings);
	const app = container.get<App>(TYPES.Application);
	await app.init();
};

bootstrap();
