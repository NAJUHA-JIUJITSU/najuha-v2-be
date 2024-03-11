import { PolicyConsentEntity } from 'src/infrastructure/database/entities/policy-consent.entity';
import { UserEntity } from 'src/infrastructure/database/entities/user.entity';

type NullableKeys = 'phoneNumber' | 'nickname' | 'gender' | 'birth' | 'belt' | 'profileImageUrlKey' | 'profileImageUrl';

export type TemporaryUserDto = {
  [K in keyof UserEntity]: K extends NullableKeys ? UserEntity[K] | null : UserEntity[K];
} & {
  policyConsents?: PolicyConsentEntity[];
};
