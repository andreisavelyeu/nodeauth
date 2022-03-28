import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Invalid email' })
	email: string;

	@IsString({ message: "Password can't be blank" })
	password: string;

	@IsString({ message: "Name can't be blank" })
	name: string;
}
