import { PolicyConsentEntity } from 'src/infra/database/entities/policy-consent.entity';
import { UserEntity } from 'src/infra/database/entities/user.entity';

type NullableKeys = 'phoneNumber' | 'nickname' | 'gender' | 'birth' | 'belt' | 'profileImageUrlKey' | 'profileImageUrl';

export type TemporaryUserDto = {
  [K in keyof UserEntity]: K extends NullableKeys ? UserEntity[K] | null : UserEntity[K];
} & {
  policyConsents?: PolicyConsentEntity[];
};
