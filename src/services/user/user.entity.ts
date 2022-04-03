import { IUserModel } from '../../models/user/user.model.interface';

export class UserEntity {
	id;
	email;
	isActivated;

	constructor(model: IUserModel) {
		this.id = model._id;
		this.email = model.email;
		this.isActivated = model.isActivated;
	}
}
