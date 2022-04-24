export interface IHashService {
	hashPassword: (password: string) => Promise<string | undefined>;
	compare: (password: string, existUserPassword: string) => Promise<boolean>;
}
