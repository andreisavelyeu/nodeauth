import { JwtPayload } from 'jsonwebtoken';

export interface ITokenService {
	generateTokens(payload: { email: string; id: string; isActivated: boolean }): {
		accessToken: string;
		refreshToken: string;
	};

	saveToken(userId: string, refreshToken: string): Promise<string>;
	removeToken(refreshToken: string): Promise<void>;
	refreshToken(refreshToken: string): Promise<void>;
	validateRefreshToken(refreshToken: string): string | JwtPayload | null;
	validateAccessToken(accessToken: string): string | JwtPayload | null;
	findRefreshToken(token: string): Promise<string>;
}
