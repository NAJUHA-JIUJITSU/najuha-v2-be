import { IUser } from 'src/interfaces/user.interface';

export type RegisterPhoneNumberDto = Pick<IUser, 'phoneNumber'>;
