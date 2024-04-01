import { IUser } from 'src/modules/users/domain/structure/user.interface';

export type RegisterPhoneNumberReqDto = Pick<IUser, 'phoneNumber'>;
