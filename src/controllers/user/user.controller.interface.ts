import { NextFunction, Request, Response } from 'express';

export interface IUserController {
	login: (req: Request, res: Response, next: NextFunction) => void;
	logout: (req: Request, res: Response, next: NextFunction) => void;
	register: (req: Request, res: Response, next: NextFunction) => void;
	activate: (req: Request, res: Response, next: NextFunction) => void;
	refreshToken: (req: Request, res: Response, next: NextFunction) => void;
	getUsers: (req: Request, res: Response, next: NextFunction) => void;
}
