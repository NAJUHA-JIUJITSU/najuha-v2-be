import { IUser } from 'src/modules/users/structure/user.interface';

export type RegisterPhoneNumberReqDto = Pick<IUser, 'phoneNumber'>;
