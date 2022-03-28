import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Invalid email' })
	email: string;

	@IsString({ message: "Password can't be blank" })
	pasword: string;
}
