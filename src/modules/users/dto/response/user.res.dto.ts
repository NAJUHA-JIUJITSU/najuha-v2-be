import { OmitOptional } from 'src/common/omit-optional.type';
import { UserEntity } from 'src/infrastructure/database/entities/user/user.entity';

export interface UserResDto extends OmitOptional<UserEntity> {}
