import { UserEntity } from 'src/users/entities/user.entity';

export type RegisterPhoneNumberDto = Pick<UserEntity, 'phoneNumber'>;
