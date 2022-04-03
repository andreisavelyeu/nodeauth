export interface ITokenService {
	generateTokens(payload: { email: string; id: string; isActivated: boolean }): {
		accessToken: string;
		refreshToken: string;
	};

	saveToken(userId: string, refreshToken: string): Promise<string>;
}
