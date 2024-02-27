import { UserEntity } from 'src/users/entities/user.entity';

// 필수 필드를 추출합니다.
type RequiredFields = Pick<UserEntity, 'snsId' | 'snsAuthProvider' | 'name' | 'email'>;

// 선택적 필드를 추출하고, 모든 필드를 선택적으로 만듭니다.
type OptionalFields = Partial<Pick<UserEntity, 'phoneNumber' | 'gender' | 'birth'>>;

// 필수 필드와 선택적 필드를 조합합니다.
export type CreateUserDto = RequiredFields & OptionalFields;
