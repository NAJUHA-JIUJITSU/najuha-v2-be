import { IPolicyConsentModelData } from '../interface/policy-consent.interface';

export class PolicyConsentModel {
  private readonly _id: IPolicyConsentModelData['id'];
  private readonly _createdAt: IPolicyConsentModelData['createdAt'];
  private readonly _userId: IPolicyConsentModelData['userId'];
  private readonly _policyId: IPolicyConsentModelData['policyId'];

  constructor(data: IPolicyConsentModelData) {
    this._id = data.id;
    this._createdAt = data.createdAt;
    this._userId = data.userId;
    this._policyId = data.policyId;
  }

  toData(): IPolicyConsentModelData {
    return {
      id: this._id,
      createdAt: this._createdAt,
      userId: this._userId,
      policyId: this._policyId,
    };
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  get userId() {
    return this._userId;
  }

  get policyId() {
    return this._policyId;
  }
}
