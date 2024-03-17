import { BusinessException, RegisterErrorMap } from 'src/common/response/errorResponse';
import { RegisterReqDto } from '../dto/request/register.req.dto';
import { User } from 'src/modules/users/domain/user.entity';
import { Policy } from 'src/modules/policy/domain/policy.entity';
import { PolicyConsent } from 'src/modules/policy/domain/policy-consent.entity';

export class RegisterUser {
  user: User & { policyConsents: PolicyConsent[] };
  registerUserConsentPolicyTypes: Policy['type'][];
  latestPolicies: Policy[];

  constructor(
    user: User,
    registerUserInfo: RegisterReqDto['user'],
    registerUserConsentPolicyTypes: Policy['type'][],
    latestPolicies: Policy[],
  ) {
    this.user = { ...user, ...registerUserInfo, role: 'USER', policyConsents: user.policyConsents || [] };
    this.registerUserConsentPolicyTypes = registerUserConsentPolicyTypes || [];
    this.latestPolicies = latestPolicies || [];
    this.setUserPolicyConsents();
  }

  private setUserPolicyConsents() {
    let policyies: Policy[] = [];
    // 이미 동의했던 약관은 추가하지 않기
    policyies = this.latestPolicies.filter(
      (policy) => !this.user.policyConsents?.some((consent) => consent.policyId === policy.id),
    );

    // 유저가 동의한 타입의 약관만 추가
    policyies = policyies.filter((policy) => this.registerUserConsentPolicyTypes.includes(policy.type));

    const policyConsents = policyies.map((policy) => {
      return {
        id: 0,
        createdAt: new Date(),
        userId: this.user.id,
        policyId: policy.id,
      };
    }) as PolicyConsent[];

    this.user.policyConsents = [...this.user.policyConsents, ...policyConsents];
  }

  private validatePhoneNumberRegistered() {
    if (!this.user.phoneNumber) {
      throw new BusinessException(RegisterErrorMap.REGISTER_PHONE_NUMBER_REQUIRED);
    }
  }

  private validateMandatoryPoliciesConseted() {
    const mandatoryPolicies = this.latestPolicies.filter((policy) => policy.isMandatory);
    const missingConsents = mandatoryPolicies.filter(
      (policy) => !this.user.policyConsents?.some((consent) => consent.policyId === policy.id),
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
    this.validatePhoneNumberRegistered();
    this.validateMandatoryPoliciesConseted();
  }
}
