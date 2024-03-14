import { IUser } from 'src/interfaces/user.interface';

export type RegisterPhoneNumberReqDto = Pick<IUser, 'phoneNumber'>;
