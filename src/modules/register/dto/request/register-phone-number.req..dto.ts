import { User } from 'src/infrastructure/database/entities/user/user.entity';

export type RegisterPhoneNumberReqDto = Pick<User, 'phoneNumber'>;
