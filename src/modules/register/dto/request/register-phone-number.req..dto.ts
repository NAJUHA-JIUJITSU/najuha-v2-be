import { User } from 'src/modules/users/domain/user.entity';

export type RegisterPhoneNumberReqDto = Pick<User, 'phoneNumber'>;
