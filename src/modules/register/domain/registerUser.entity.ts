import { BusinessException, RegisterErrorMap } from 'src/common/response/errorResponse';
import { RegisterReqDto } from '../dto/request/register.req.dto';
import { UserEntity } from 'src/infrastructure/database/entities/user/user.entity';
import { PolicyConsentEntity } from 'src/infrastructure/database/entities/policy/policy-consent.entity';
import { PolicyEntity } from 'src/infrastructure/database/entities/policy/policy.entity';

export class RegisterUser {
  user: Omit<UserEntity, 'policyConsents'>;
  existingPolicyConsents: PolicyConsentEntity[];
  newPolicyConsents: PolicyConsentEntity[];
  registerUserConsentPolicyTypes: PolicyEntity['type'][];
  latestPolicies: PolicyEntity[];

  constructor(
    user: Omit<UserEntity, 'policyConsents'>,
    existingPolicyConsents: PolicyConsentEntity[] = [],
    registerUserInfo: RegisterReqDto['user'],
    registerUserConsentPolicyTypes: PolicyEntity['type'][],
    latestPolicies: PolicyEntity[],
  ) {
    this.user = { ...user, ...registerUserInfo };
    this.existingPolicyConsents = existingPolicyConsents;
    this.registerUserConsentPolicyTypes = registerUserConsentPolicyTypes || [];
    this.latestPolicies = latestPolicies || [];
    this.setNewPolicyConsents();
  }

  private setNewPolicyConsents() {
    const unconsentedPolicies = this.latestPolicies.filter(
      (policy) =>
        !this.existingPolicyConsents.some((consent) => consent.policyId === policy.id) &&
        this.registerUserConsentPolicyTypes.includes(policy.type),
    );

    this.newPolicyConsents = unconsentedPolicies.map((policy) => {
      const policyConsent = new PolicyConsentEntity();
      policyConsent.createdAt = new Date();
      policyConsent.userId = this.user.id;
      policyConsent.policyId = policy.id;
      return policyConsent;
    });
  }

  private ensurePhoneNumberRegistered() {
    if (!this.user.phoneNumber) {
      throw new BusinessException(RegisterErrorMap.REGISTER_PHONE_NUMBER_REQUIRED);
    }
  }

  private ensureMandatoryPoliciesConsented() {
    const userConsentedPolices = [...this.existingPolicyConsents, ...this.newPolicyConsents];
    const mandatoryPolicies = this.latestPolicies.filter((policy) => policy.isMandatory);
    const missingConsents = mandatoryPolicies.filter(
      (policy) => !userConsentedPolices?.some((consent) => consent.policyId === policy.id),
    );
    if (missingConsents.length > 0) {
      const missingPolicyTypes = missingConsents.map((policy) => policy.type).join(', ');
      throw new BusinessException(
        RegisterErrorMap.REGISTER_POLICY_CONSENT_REQUIRED,
        `다음 필수 약관에 동의하지 않았습니다: ${missingPolicyTypes}`,
      );
    }
  }

  validate() {
    this.ensurePhoneNumberRegistered();
    this.ensureMandatoryPoliciesConsented();
  }
}
