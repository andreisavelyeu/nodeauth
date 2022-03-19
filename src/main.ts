import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ConfigService } from './services/config/config.service';
import { IConfig } from './services/config/config.service.interface';
import { ILogger } from './services/logger/logger.interface';
import { LoggerService } from './services/logger/logger.service';
import { TYPES } from './types';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IConfig>(TYPES.IConfig).to(ConfigService).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
});
const bootstrap = async (): Promise<void> => {
	const container = new Container();
	container.load(appBindings);
	const app = container.get<App>(TYPES.Application);
	await app.init();
};

bootstrap();
