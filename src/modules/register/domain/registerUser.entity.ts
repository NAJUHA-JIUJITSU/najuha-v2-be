import { UserEntity } from 'src/infra/database/entities/user.entity';
import { PolicyConsentEntity } from 'src/infra/database/entities/policy-consent.entity';
import { PolicyEntity } from 'src/infra/database/entities/policy.entity';
import { BusinessException, RegisterErrorMap } from 'src/common/response/errorResponse';
import { RegisterDto } from '../dto/register.dto';

export class RegisterUserEntity {
  user: UserEntity;
  policyConsents: PolicyConsentEntity[];
  private latestPolicies: PolicyEntity[];

  constructor(user: UserEntity, registerUserInfo: RegisterDto['user'], latestPolicies: PolicyEntity[]) {
    this.user = { ...user, ...registerUserInfo };
    this.latestPolicies = latestPolicies;
    this.policyConsents = user.policyConsents || [];
  }

  verifyPhoneNumberRegistered() {
    if (!this.user.phoneNumber) {
      throw new BusinessException(RegisterErrorMap.REGISTER_PHONE_NUMBER_REQUIRED);
    }
  }

  verifyMandatoryPoliciesConseted() {
    const mandatoryPolicies = this.latestPolicies.filter((policy) => policy.isMandatory);
    const missingConsents = mandatoryPolicies.filter(
      (policy) => !this.policyConsents.some((consent) => consent.policyId === policy.id),
    );
    if (missingConsents.length > 0) {
      const missingPolicyTypes = missingConsents.map((policy) => policy.type).join(', ');
      throw new BusinessException(
        RegisterErrorMap.REGISTER_POLICY_CONSENT_REQUIRED,
        `다음 필수 약관에 동의하지 않았습니다: ${missingPolicyTypes}`,
      );
    }
  }

  setPolicyConsents(latestPolicies: PolicyEntity[], consentPolicyTypes: string[]): void {
    const unconsetedPolicies = latestPolicies.filter(
      (policy) => !this.policyConsents.some((consent) => consent.policyId === policy.id),
    );
    const policyConsents = unconsetedPolicies.reduce((acc, policy) => {
      if (
        consentPolicyTypes.includes(policy.type) &&
        this.policyConsents.every((consent) => consent.policyId !== policy.id)
      ) {
        const consent = new PolicyConsentEntity();
        consent.user = this.user;
        consent.policy = policy;
        consent.userId = this.user.id;
        consent.policyId = policy.id;
        acc.push(consent);
      }
      return acc;
    }, [] as PolicyConsentEntity[]);
    this.policyConsents = [...this.policyConsents, ...policyConsents];
  }
}
