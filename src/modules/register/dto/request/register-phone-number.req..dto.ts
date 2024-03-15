import { UserEntity } from 'src/infrastructure/database/entities/user.entity';

export type RegisterPhoneNumberReqDto = Pick<UserEntity, 'phoneNumber'>;
