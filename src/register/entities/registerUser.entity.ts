import { UserEntity } from 'src/users/entities/user.entity';
import { PolicyConsentEntity } from 'src/policy-consents/entity/policy-consent.entity';
import { PolicyEntity } from 'src/policy/entities/policy.entity';
import { BusinessException, RegisterErrorMap } from 'src/common/response/errorResponse';
import { RegisterDto } from '../dto/register.dto';

export class RegisterUserEntity {
  user: UserEntity;
  policyConsents: PolicyConsentEntity[];

  constructor(user: UserEntity, registerUserInfo: RegisterDto['user'], policyConsents: PolicyConsentEntity[] = []) {
    this.user = Object.assign(user, registerUserInfo);
    this.policyConsents = policyConsents;
  }

  setPolicyConsents(policyConsents: PolicyConsentEntity[] = []) {
    this.policyConsents = policyConsents;
  }

  verifyPhoneNumberRegistered() {
    if (!this.user.phoneNumber) {
      throw new BusinessException(RegisterErrorMap.REGISTER_PHONE_NUMBER_REQUIRED);
    }
  }

  verifyMandatoryPolicyConsents(mandatoryPolicies: PolicyEntity[]) {
    mandatoryPolicies.forEach((policy) => {
      if (!this.policyConsents.some((policyConsent) => policyConsent.policyId === policy.id)) {
        throw new BusinessException(RegisterErrorMap.REGISTER_POLICY_CONSENT_REQUIRED);
      }
    });
  }

  // Additional registration-specific methods...
}
