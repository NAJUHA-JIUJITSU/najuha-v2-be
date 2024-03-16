import { UserEntity } from 'src/modules/users/domain/user.entity';

export type RegisterPhoneNumberReqDto = Pick<UserEntity, 'phoneNumber'>;
