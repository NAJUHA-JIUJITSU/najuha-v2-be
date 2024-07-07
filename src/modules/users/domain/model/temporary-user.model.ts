import {
  IRegisteredUserModelData,
  ITemporaryUserModelData,
  IUserRgistertDto,
} from '../interface/temporary-user.interface';
import { BusinessException, RegisterErrors } from '../../../../common/response/errorResponse';
import { assert } from 'typia';
import { PolicyConsentModel } from './policy-consent.model';
import { PolicyModel } from '../../../policy/domain/model/policy.model';

export class TemporaryUserModel {
  /** properties */
  private readonly _id: ITemporaryUserModelData['id'];
  private readonly _snsAuthProvider: ITemporaryUserModelData['snsAuthProvider'];
  private readonly _snsId: ITemporaryUserModelData['snsId'];
  private readonly _email: ITemporaryUserModelData['email'];
  private readonly _createdAt: ITemporaryUserModelData['createdAt'];
  private readonly _updatedAt: ITemporaryUserModelData['updatedAt'];
  private _role: ITemporaryUserModelData['role'];
  private _name: ITemporaryUserModelData['name'];
  private _nickname: ITemporaryUserModelData['nickname'];
  private _gender: ITemporaryUserModelData['gender'];
  private _birth: ITemporaryUserModelData['birth'];
  private _belt: ITemporaryUserModelData['belt'];
  private _status: ITemporaryUserModelData['status'];
  private _phoneNumber: ITemporaryUserModelData['phoneNumber'];
  /** relations */
  private _policyConsents?: PolicyConsentModel[];

  constructor(data: ITemporaryUserModelData) {
    this._id = data.id;
    this._role = data.role;
    this._snsAuthProvider = data.snsAuthProvider;
    this._snsId = data.snsId;
    this._email = data.email;
    this._name = data.name;
    this._phoneNumber = data.phoneNumber;
    this._gender = data.gender;
    this._birth = data.birth;
    this._nickname = data.nickname;
    this._belt = data.belt;
    this._status = data.status;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
    this._policyConsents = data.policyConsents?.map((consent) => new PolicyConsentModel(consent));
  }

  toData(): ITemporaryUserModelData {
    return {
      id: this._id,
      role: this._role,
      snsAuthProvider: this._snsAuthProvider,
      snsId: this._snsId,
      email: this._email,
      name: this._name,
      phoneNumber: this._phoneNumber,
      gender: this._gender,
      birth: this._birth,
      nickname: this._nickname,
      belt: this._belt,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      policyConsents: this._policyConsents?.map((consent) => consent.toData()),
    };
  }

  toRegisteredUserModelData() {
    return assert<IRegisteredUserModelData>({
      id: this._id,
      role: this._role,
      snsAuthProvider: this._snsAuthProvider,
      snsId: this._snsId,
      email: this._email,
      name: this._name,
      phoneNumber: this._phoneNumber,
      gender: this._gender,
      birth: this._birth,
      nickname: this._nickname,
      belt: this._belt,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      policyConsents: this._policyConsents?.map((consent) => consent.toData()),
    });
  }

  get id() {
    return this._id;
  }

  get snsAuthProvider() {
    return this._snsAuthProvider;
  }

  get snsId() {
    return this._snsId;
  }

  get email() {
    return this._email;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get role() {
    return this._role;
  }

  get name() {
    return this._name;
  }

  get nickname() {
    return this._nickname;
  }

  get gender() {
    return this._gender;
  }

  get birth() {
    return this._birth;
  }

  get belt() {
    return this._belt;
  }

  get status() {
    return this._status;
  }

  get phoneNumber() {
    return this._phoneNumber;
  }

  get policyConsents() {
    return this._policyConsents;
  }

  updateRegistrationData(policyConsents: PolicyConsentModel[], userRegisterDto: IUserRgistertDto) {
    this._policyConsents = policyConsents;
    this._nickname = userRegisterDto.nickname;
    this._gender = userRegisterDto.gender;
    this._belt = userRegisterDto.belt;
    this._birth = userRegisterDto.birth;
    this._role = 'USER';
  }

  updataPhoneNumber(phoneNumber: ITemporaryUserModelData['phoneNumber']) {
    this._phoneNumber = phoneNumber;
  }

  public ensurePhoneNumberRegistered() {
    if (!this._phoneNumber) {
      throw new BusinessException(RegisterErrors.REGISTER_PHONE_NUMBER_REQUIRED);
    }
  }

  public ensureMandatoryPoliciesConsented(mandatoryPolicies: PolicyModel[]) {
    const missingConsents = mandatoryPolicies.filter(
      (policy) => !this._policyConsents?.some((consent) => consent.policyId === policy.id),
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
