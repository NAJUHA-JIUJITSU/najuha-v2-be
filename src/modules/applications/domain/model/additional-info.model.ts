import { IAdditionalInfoModelData } from '../interface/additional-info.interface';

export class AdditionalInfoModel {
  /** properties */
  private readonly _id: IAdditionalInfoModelData['id'];
  private readonly _createdAt: IAdditionalInfoModelData['createdAt'];
  private readonly _updatedAt: IAdditionalInfoModelData['updatedAt'];
  private readonly _type: IAdditionalInfoModelData['type'];
  private readonly _applicationId: IAdditionalInfoModelData['applicationId'];
  private _value: IAdditionalInfoModelData['value'];

  constructor(data: IAdditionalInfoModelData) {
    this._id = data.id;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
    this._type = data.type;
    this._applicationId = data.applicationId;
    this._value = data.value;
  }

  toData(): IAdditionalInfoModelData {
    return {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      type: this._type,
      applicationId: this._applicationId,
      value: this._value,
    };
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get type() {
    return this._type;
  }

  get applicationId() {
    return this._applicationId;
  }

  get value() {
    return this._value;
  }

  updateValue(value: string) {
    this._value = value;
  }
}
