import { Schema, model } from 'mongoose';

const TokenSchema = new Schema({
	refreshToken: { type: String, required: true },
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	// TODO add fingerprint of browser
});

export default model('Token', TokenSchema);
