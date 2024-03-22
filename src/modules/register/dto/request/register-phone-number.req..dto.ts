import { UserEntity } from 'src/infrastructure/database/entities/user/user.entity';

export type RegisterPhoneNumberReqDto = Pick<UserEntity, 'phoneNumber'>;
