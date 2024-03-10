import { UserEntity } from 'src/infra/database/entities/user.entity';

export type RegisterPhoneNumberDto = Pick<UserEntity, 'phoneNumber'>;
