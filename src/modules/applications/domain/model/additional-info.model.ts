import { IAdditionalInfo } from '../interface/additional-info.interface';

export class AdditionalInfoModel {
  private readonly id: IAdditionalInfo['id'];
  private readonly createdAt: IAdditionalInfo['createdAt'];
  private readonly updatedAt: IAdditionalInfo['updatedAt'];
  private readonly type: IAdditionalInfo['type'];
  private readonly applicationId: IAdditionalInfo['applicationId'];
  private value: IAdditionalInfo['value'];

  constructor(entity: IAdditionalInfo) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.type = entity.type;
    this.applicationId = entity.applicationId;
    this.value = entity.value;
  }

  toEntity() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      type: this.type,
      applicationId: this.applicationId,
      value: this.value,
    };
  }

  getType() {
    return this.type;
  }

  updateValue(value: string) {
    this.value = value;
  }
}
