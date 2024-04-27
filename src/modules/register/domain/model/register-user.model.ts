import { BusinessException, RegisterErrors } from 'src/common/response/errorResponse';
import { IPolicyFindMany } from 'src/modules/policy/domain/interface/policy.interface';
import { IRegisterUser, IUserRgistertDto } from 'src/modules/users/domain/interface/user.interface';
import { IPolicyConsent } from '../interface/policy-consent.interface';

export class RegisterUserModel {
  private readonly id: IRegisterUser['id'];
  private role: IRegisterUser['role'];
  private nickname: IRegisterUser['nickname'];
  private gender: IRegisterUser['gender'];
  private birth: IRegisterUser['birth'];
  private belt: IRegisterUser['belt'];
  private readonly snsAuthProvider: IRegisterUser['snsAuthProvider'];
  private readonly snsId: IRegisterUser['snsId'];
  private readonly email: IRegisterUser['email'];
  private readonly name: IRegisterUser['name'];
  private readonly phoneNumber: IRegisterUser['phoneNumber'];
  private readonly profileImageUrlKey: IRegisterUser['profileImageUrlKey'];
  private readonly status: IRegisterUser['status'];
  private readonly createdAt: IRegisterUser['createdAt'];
  private readonly updatedAt: IRegisterUser['updatedAt'];
  private readonly policyConsents: IPolicyConsent[];

  constructor(entity: IRegisterUser) {
    this.id = entity.id;
    this.role = entity.role;
    this.snsAuthProvider = entity.snsAuthProvider;
    this.snsId = entity.snsId;
    this.email = entity.email;
    this.name = entity.name;
    this.phoneNumber = entity.phoneNumber;
    this.nickname = entity.nickname;
    this.gender = entity.gender;
    this.birth = entity.birth;
    this.belt = entity.belt;
    this.profileImageUrlKey = entity.profileImageUrlKey;
    this.status = entity.status;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.policyConsents = entity.policyConsents;
  }

  toEntity(): IRegisterUser {
    return {
      id: this.id,
      role: this.role,
      snsAuthProvider: this.snsAuthProvider,
      snsId: this.snsId,
      email: this.email,
      name: this.name,
      phoneNumber: this.phoneNumber,
      nickname: this.nickname,
      gender: this.gender,
      birth: this.birth,
      belt: this.belt,
      profileImageUrlKey: this.profileImageUrlKey,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      policyConsents: this.policyConsents,
    };
  }

  getId() {
    return this.id;
  }

  getRole() {
    return this.role;
  }

  addPolicyConsent(policyConsents: IPolicyConsent[]) {
    const newPolicyConsents = policyConsents.filter(
      (policyConsent) => !this.policyConsents.some((consent) => consent.policyId === policyConsent.policyId),
    );
    this.policyConsents.push(...newPolicyConsents);
  }

  register(userRegisterDto: IUserRgistertDto, mandatoryPolicies: IPolicyFindMany[]) {
    this.ensurePhoneNumberRegistered();
    this.ensureMandatoryPoliciesConsented(mandatoryPolicies);
    this.nickname = userRegisterDto.nickname;
    this.gender = userRegisterDto.gender;
    this.belt = userRegisterDto.belt;
    this.birth = userRegisterDto.birth;
    this.role = 'USER';
  }

  private ensurePhoneNumberRegistered() {
    if (!this.phoneNumber) {
      throw new BusinessException(RegisterErrors.REGISTER_PHONE_NUMBER_REQUIRED);
    }
  }

  private ensureMandatoryPoliciesConsented(mandatoryPolicies: IPolicyFindMany[]) {
    const missingConsents = mandatoryPolicies.filter(
      (policy) => !this.policyConsents?.some((consent) => consent.policyId === policy.id),
    );
    if (missingConsents.length > 0) {
      const missingPolicyTypes = missingConsents.map((policy) => policy.type).join(', ');
      throw new BusinessException(
        RegisterErrors.REGISTER_POLICY_CONSENT_REQUIRED,
        `다음 필수 약관에 동의하지 않았습니다: ${missingPolicyTypes}`,
      );
    }
  }
}
