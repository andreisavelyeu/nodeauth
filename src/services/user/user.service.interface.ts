import { UserEntity } from './user.entity';

export interface UserAndTokens {
	user: UserEntity;
	accessToken: string;
	refreshToken: string;
}

export interface IUserService {
	register(email: string, password: string): Promise<UserAndTokens>;
	activate(activationLink: string): Promise<void>;
	login(email: string, password: string): Promise<UserAndTokens>;
	logout(refreshToken: string): Promise<void>;
	refreshToken(refreshToken: string): Promise<UserAndTokens>;
	getAllUsers(): Promise<UserEntity[]>;
}
