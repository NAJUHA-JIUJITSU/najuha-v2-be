import { User } from 'src/modules/users/domain/entities/user.entity';

export type RegisterPhoneNumberReqDto = Pick<User, 'phoneNumber'>;
