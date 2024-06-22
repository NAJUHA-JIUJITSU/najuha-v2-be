import { uuidv7 } from 'uuidv7';
import { IPolicyConsentCreateDto, IPolicyConsentModelData } from '../interface/policy-consent.interface';

export class PolicyConsentModel {
  private readonly id: IPolicyConsentModelData['id'];
  private readonly createdAt: IPolicyConsentModelData['createdAt'];
  private readonly userId: IPolicyConsentModelData['userId'];
  private readonly policyId: IPolicyConsentModelData['policyId'];

  static create(dto: IPolicyConsentCreateDto): PolicyConsentModel {
    return new PolicyConsentModel({
      id: uuidv7(),
      userId: dto.userId,
      policyId: dto.policyId,
      createdAt: new Date(),
    });
  }

  constructor(data: IPolicyConsentModelData) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.userId = data.userId;
    this.policyId = data.policyId;
  }

  toData(): IPolicyConsentModelData {
    return {
      id: this.id,
      createdAt: this.createdAt,
      userId: this.userId,
      policyId: this.policyId,
    };
  }

  getId() {
    return this.id;
  }

  getPolicId() {
    return this.policyId;
  }
}
