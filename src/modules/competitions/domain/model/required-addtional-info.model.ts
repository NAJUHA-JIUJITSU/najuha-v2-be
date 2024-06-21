import {
  IRequiredAdditionalInfo,
  IRequiredAdditionalInfoUpdateDto,
} from '../interface/required-addtional-info.interface';

export class RequiredAdditionalInfoModel {
  public readonly id: IRequiredAdditionalInfo['id'];
  public readonly type: IRequiredAdditionalInfo['type'];
  public description: IRequiredAdditionalInfo['description'];
  public readonly createdAt: IRequiredAdditionalInfo['createdAt'];
  public deletedAt: IRequiredAdditionalInfo['deletedAt'];
  public readonly competitionId: IRequiredAdditionalInfo['competitionId'];

  constructor(entity: IRequiredAdditionalInfo) {
    this.id = entity.id;
    this.type = entity.type;
    this.description = entity.description;
    this.createdAt = entity.createdAt;
    this.deletedAt = entity.deletedAt;
    this.competitionId = entity.competitionId;
  }

  toData(): IRequiredAdditionalInfo {
    return {
      id: this.id,
      type: this.type,
      description: this.description,
      createdAt: this.createdAt,
      deletedAt: this.deletedAt,
      competitionId: this.competitionId,
    };
  }

  update(requiredAdditionalInfoUpdateDto: IRequiredAdditionalInfoUpdateDto) {
    this.description = requiredAdditionalInfoUpdateDto.description;
  }

  delete() {
    this.deletedAt = new Date();
  }
}
