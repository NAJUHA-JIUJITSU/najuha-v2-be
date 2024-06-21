import { uuidv7 } from 'uuidv7';
import {
  IRegisteredUserModelData,
  ITemporaryUserCreateDto,
  ITemporaryUserModelData,
  IUserRgistertDto,
} from '../interface/temporary-user.interface';
import { IPolicyConsent } from '../../../register/domain/interface/policy-consent.interface';
import { IPolicySummery } from '../../../policy/domain/interface/policy.interface';
import { BusinessException, RegisterErrors } from '../../../../common/response/errorResponse';
import { assert } from 'typia';

export class TemporaryUserModel {
  private readonly id: ITemporaryUserModelData['id'];
  private readonly snsAuthProvider: ITemporaryUserModelData['snsAuthProvider'];
  private readonly snsId: ITemporaryUserModelData['snsId'];
  private readonly email: ITemporaryUserModelData['email'];
  private readonly createdAt: ITemporaryUserModelData['createdAt'];
  private readonly updatedAt: ITemporaryUserModelData['updatedAt'];
  private role: ITemporaryUserModelData['role'];
  private name: ITemporaryUserModelData['name'];
  private nickname: ITemporaryUserModelData['nickname'];
  private gender: ITemporaryUserModelData['gender'];
  private birth: ITemporaryUserModelData['birth'];
  private belt: ITemporaryUserModelData['belt'];
  private status: ITemporaryUserModelData['status'];
  private phoneNumber: ITemporaryUserModelData['phoneNumber'];
  private policyConsents?: IPolicyConsent[];

  static create(dto: ITemporaryUserCreateDto): TemporaryUserModel {
    return new TemporaryUserModel({
      id: uuidv7(),
      role: 'TEMPORARY_USER',
      snsAuthProvider: dto.snsAuthProvider,
      snsId: dto.snsId,
      email: dto.email,
      name: dto.name,
      phoneNumber: dto.phoneNumber || null,
      gender: dto.gender || null,
      birth: dto.birth || null,
      nickname: null,
      belt: null,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  constructor(data: ITemporaryUserModelData) {
    this.id = data.id;
    this.role = data.role;
    this.snsAuthProvider = data.snsAuthProvider;
    this.snsId = data.snsId;
    this.email = data.email;
    this.name = data.name;
    this.phoneNumber = data.phoneNumber;
    this.gender = data.gender;
    this.birth = data.birth;
    this.nickname = data.nickname;
    this.belt = data.belt;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.policyConsents = data.policyConsents;
  }

  toData(): ITemporaryUserModelData {
    return {
      id: this.id,
      role: this.role,
      snsAuthProvider: this.snsAuthProvider,
      snsId: this.snsId,
      email: this.email,
      name: this.name,
      phoneNumber: this.phoneNumber,
      gender: this.gender,
      birth: this.birth,
      nickname: this.nickname,
      belt: this.belt,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      policyConsents: this.policyConsents,
    };
  }

  toRegisteredUserModelData() {
    return assert<IRegisteredUserModelData>({
      id: this.id,
      role: this.role,
      snsAuthProvider: this.snsAuthProvider,
      snsId: this.snsId,
      email: this.email,
      name: this.name,
      phoneNumber: this.phoneNumber,
      gender: this.gender,
      birth: this.birth,
      nickname: this.nickname,
      belt: this.belt,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      policyConsents: this.policyConsents,
    });
  }

  getId() {
    return this.id;
  }

  getRole() {
    return this.role;
  }

  updataPhoneNumber(phoneNumber: ITemporaryUserModelData['phoneNumber']) {
    this.phoneNumber = phoneNumber;
  }

  addPolicyConsents(policyConsents: IPolicyConsent[]) {
    this.policyConsents = policyConsents;
  }

  register(userRegisterDto: IUserRgistertDto, mandatoryPolicies: IPolicySummery[]) {
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

  private ensureMandatoryPoliciesConsented(mandatoryPolicies: IPolicySummery[]) {
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
