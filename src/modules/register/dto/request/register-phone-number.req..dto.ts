import { IUser } from 'src/modules/users/domain/interface/user.interface';

export type RegisterPhoneNumberReqDto = Pick<IUser, 'phoneNumber'>;
