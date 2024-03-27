import { IUser } from 'src/modules/users/structure/interface/user.interface';

export type RegisterPhoneNumberReqDto = Pick<IUser, 'phoneNumber'>;
