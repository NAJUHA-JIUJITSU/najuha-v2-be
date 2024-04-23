import { BusinessException, RegisterErrorMap } from 'src/common/response/errorResponse';
import { IPolicy } from 'src/modules/policy/domain/interface/policy.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';

export class RegisterUserModel {
  private id: IUser.Entity.RegisterUser['id'];
  private role: IUser.Entity.RegisterUser['role'];
  private snsAuthProvider: IUser.Entity.RegisterUser['snsAuthProvider'];
  private snsId: IUser.Entity.RegisterUser['snsId'];
  private email: IUser.Entity.RegisterUser['email'];
  private name: IUser.Entity.RegisterUser['name'];
  private phoneNumber: IUser.Entity.RegisterUser['phoneNumber'];
  private nickname: IUser.Entity.RegisterUser['nickname'];
  private gender: IUser.Entity.RegisterUser['gender'];
  private birth: IUser.Entity.RegisterUser['birth'];
  private belt: IUser.Entity.RegisterUser['belt'];
  private profileImageUrlKey: IUser.Entity.RegisterUser['profileImageUrlKey'];
  private status: IUser.Entity.RegisterUser['status'];
  private createdAt: IUser.Entity.RegisterUser['createdAt'];
  private updatedAt: IUser.Entity.RegisterUser['updatedAt'];
  private policyConsents: IUser.Entity.RegisterUser['policyConsents'];

  constructor(entity: IUser.Entity.RegisterUser) {
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

  toEntity(): IUser.Entity.RegisterUser {
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

  register(userRegisterDto: IUser.Dto.Register, mandatoryPolicies: IPolicy[]) {
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
      throw new BusinessException(RegisterErrorMap.REGISTER_PHONE_NUMBER_REQUIRED);
    }
  }

  private ensureMandatoryPoliciesConsented(mandatoryPolicies: IPolicy[]) {
    const missingConsents = mandatoryPolicies.filter(
      (policy) => !this.policyConsents?.some((consent) => consent.policyId === policy.id),
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
