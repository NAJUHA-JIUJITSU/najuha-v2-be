import { IUser } from 'src/modules/users/domain/user.interface';

export type RegisterPhoneNumberReqDto = Pick<IUser, 'phoneNumber'>;
