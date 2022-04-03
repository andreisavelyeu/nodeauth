import { UserEntity } from './user.entity';

export interface Registration {
	user: UserEntity;
	accessToken: string;
	refreshToken: string;
}
export interface IUserService {
	register(email: string, password: string): Promise<Registration>;
}
