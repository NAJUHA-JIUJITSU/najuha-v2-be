import {
  IRequiredAdditionalInfoModelData,
  IRequiredAdditionalInfoUpdateDto,
} from '../interface/required-addtional-info.interface';

export class RequiredAdditionalInfoModel {
  private readonly id: IRequiredAdditionalInfoModelData['id'];
  private readonly type: IRequiredAdditionalInfoModelData['type'];
  private description: IRequiredAdditionalInfoModelData['description'];
  private deletedAt: IRequiredAdditionalInfoModelData['deletedAt'];
  private readonly createdAt: IRequiredAdditionalInfoModelData['createdAt'];
  private readonly competitionId: IRequiredAdditionalInfoModelData['competitionId'];

  constructor(data: IRequiredAdditionalInfoModelData) {
    this.id = data.id;
    this.type = data.type;
    this.description = data.description;
    this.createdAt = data.createdAt;
    this.deletedAt = data.deletedAt;
    this.competitionId = data.competitionId;
  }

  toData(): IRequiredAdditionalInfoModelData {
    return {
      id: this.id,
      type: this.type,
      description: this.description,
      createdAt: this.createdAt,
      deletedAt: this.deletedAt,
      competitionId: this.competitionId,
    };
  }

  getId() {
    return this.id;
  }

  getType() {
    return this.type;
  }

  update(requiredAdditionalInfoUpdateDto: IRequiredAdditionalInfoUpdateDto) {
    this.description = requiredAdditionalInfoUpdateDto.description;
  }

  delete() {
    this.deletedAt = new Date();
  }
}
