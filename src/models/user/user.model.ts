import { Schema, model } from 'mongoose';
import { IUserModel } from './user.model.interface';

const UserSchema = new Schema<IUserModel>({
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	isActivated: { type: Boolean, default: false },
	activationLink: { type: String },
});

export default model<IUserModel>('User', UserSchema);
