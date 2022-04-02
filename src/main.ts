import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { UserController } from './controllers/user/user.controller';
import { IUserController } from './controllers/user/user.controller.interface';
import { ConfigService } from './services/config/config.service';
import { IConfig } from './services/config/config.service.interface';
import { ILogger } from './services/logger/logger.interface';
import { LoggerService } from './services/logger/logger.service';
import { MongoService } from './services/mongo/mongo.service';
import { TYPES } from './types';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IConfig>(TYPES.IConfig).to(ConfigService).inSingletonScope();
	bind<MongoService>(TYPES.MongoService).to(MongoService).inSingletonScope();
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<App>(TYPES.Application).to(App);
});
const bootstrap = async (): Promise<void> => {
	const container = new Container();
	container.load(appBindings);
	const app = container.get<App>(TYPES.Application);
	await app.init();
};

bootstrap();
