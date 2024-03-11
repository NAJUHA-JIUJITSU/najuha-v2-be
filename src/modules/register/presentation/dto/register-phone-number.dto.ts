import { UserEntity } from 'src/infrastructure/database/entities/user.entity';

export type RegisterPhoneNumberDto = Pick<UserEntity, 'phoneNumber'>;
