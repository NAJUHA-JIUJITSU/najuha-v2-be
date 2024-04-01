import { Injectable } from '@nestjs/common';
import { BusinessException, RegisterErrorMap } from 'src/common/response/errorResponse';
import { IRegisterUser } from './structure/register-user.interface';
import { RegisterRepository } from '../register.repository';

@Injectable()
export class RegisterValidator {
  constructor(private readonly registerRepository: RegisterRepository) {}

  async validate(user: IRegisterUser) {
    this.ensurePhoneNumberRegistered(user);
    await this.ensureMandatoryPoliciesConsented(user);
  }

  private ensurePhoneNumberRegistered(user: IRegisterUser): void {
    if (!user.phoneNumber) {
      throw new BusinessException(RegisterErrorMap.REGISTER_PHONE_NUMBER_REQUIRED);
    }
  }

  private async ensureMandatoryPoliciesConsented(user: IRegisterUser): Promise<void> {
    const mandatoryPolicies = await this.registerRepository.findAllMandatoryPolicies();
    const missingConsents = mandatoryPolicies.filter(
      (policy) => !user.policyConsents?.some((consent) => consent.policyId === policy.id),
    );
    if (missingConsents.length > 0) {
      const missingPolicyTypes = missingConsents.map((policy) => policy.type).join(', ');
      throw new BusinessException(
        RegisterErrorMap.REGISTER_POLICY_CONSENT_REQUIRED,
        `다음 필수 약관에 동의하지 않았습니다: ${missingPolicyTypes}`,
      );
    }
  }
}
