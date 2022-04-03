export interface IHashService {
	hashPassword: (password: string) => Promise<string | undefined>;
}
