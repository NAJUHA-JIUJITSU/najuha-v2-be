import { OmitOptional } from 'src/common/omit-optional.type';
import { User } from 'src/modules/users/domain/entities/user.entity';

export interface UserResDto extends OmitOptional<User> {}
