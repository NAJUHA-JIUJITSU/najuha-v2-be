import { IAdditionalInfoModelData } from '../interface/additional-info.interface';

export class AdditionalInfoModel {
  private readonly id: IAdditionalInfoModelData['id'];
  private readonly createdAt: IAdditionalInfoModelData['createdAt'];
  private readonly updatedAt: IAdditionalInfoModelData['updatedAt'];
  private readonly type: IAdditionalInfoModelData['type'];
  private readonly applicationId: IAdditionalInfoModelData['applicationId'];
  private value: IAdditionalInfoModelData['value'];

  constructor(data: IAdditionalInfoModelData) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.type = data.type;
    this.applicationId = data.applicationId;
    this.value = data.value;
  }

  toData(): IAdditionalInfoModelData {
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
