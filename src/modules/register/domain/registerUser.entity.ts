import { BusinessException, RegisterErrorMap } from 'src/common/response/errorResponse';
import { RegisterReqDto } from '../structure/dto/request/register.req.dto';
import { IUser } from 'src/modules/users/structure/user.interface';
import { IPolicyConsent } from 'src/modules/policy/structure/policy-consent.interface';
import { IPolicy } from 'src/modules/policy/structure/policy.interface';

export class RegisterUser {
  user: Omit<IUser, 'policyConsents'>;
  existingPolicyConsents: IPolicyConsent[];
  newPolicyConsents: IPolicyConsent[];
  registerUserConsentPolicyTypes: IPolicy['type'][];
  latestPolicies: IPolicy[];

  constructor(
    user: Omit<IUser, 'policyConsents'>,
    existingPolicyConsents: IPolicyConsent[] = [],
    registerUserInfo: RegisterReqDto['user'],
    registerUserConsentPolicyTypes: IPolicy['type'][],
    latestPolicies: IPolicy[],
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
      return {
        id: 0,
        createdAt: new Date(),
        userId: this.user.id,
        policyId: policy.id,
      };
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
