import { IsEmail, IsString } from 'class-validator';

// todo add proper email and password check
export class UserRegisterDto {
	@IsEmail({}, { message: 'Invalid email' })
	email: string;

	@IsString({ message: "Password can't be blank" })
	password: string;
}
