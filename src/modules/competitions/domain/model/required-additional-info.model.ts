import {
  IRequiredAdditionalInfoModelData,
  IRequiredAdditionalInfoUpdateDto,
} from '../interface/required-additional-info.interface';

export class RequiredAdditionalInfoModel {
  /** properties */
  private readonly _id: IRequiredAdditionalInfoModelData['id'];
  private readonly _type: IRequiredAdditionalInfoModelData['type'];
  private _description: IRequiredAdditionalInfoModelData['description'];
  private _deletedAt: IRequiredAdditionalInfoModelData['deletedAt'];
  private readonly _createdAt: IRequiredAdditionalInfoModelData['createdAt'];
  private readonly _competitionId: IRequiredAdditionalInfoModelData['competitionId'];

  constructor(data: IRequiredAdditionalInfoModelData) {
    this._id = data.id;
    this._type = data.type;
    this._description = data.description;
    this._createdAt = data.createdAt;
    this._deletedAt = data.deletedAt;
    this._competitionId = data.competitionId;
  }

  toData(): IRequiredAdditionalInfoModelData {
    return {
      id: this._id,
      type: this._type,
      description: this._description,
      createdAt: this._createdAt,
      deletedAt: this._deletedAt,
      competitionId: this._competitionId,
    };
  }

  get id() {
    return this._id;
  }

  get type() {
    return this._type;
  }

  get description() {
    return this._description;
  }

  get deletedAt() {
    return this._deletedAt;
  }

  get createdAt() {
    return this._createdAt;
  }

  get competitionId() {
    return this._competitionId;
  }

  update(requiredAdditionalInfoUpdateDto: IRequiredAdditionalInfoUpdateDto) {
    this._description = requiredAdditionalInfoUpdateDto.description;
  }

  delete() {
    this._deletedAt = new Date();
  }
}
