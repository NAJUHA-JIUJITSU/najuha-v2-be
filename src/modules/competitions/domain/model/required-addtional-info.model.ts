import { IRequiredAdditionalInfo } from '../interface/required-addtional-info.interface';

export class RequiredAdditionalInfoModel {
  public readonly id: IRequiredAdditionalInfo['id'];
  public readonly type: IRequiredAdditionalInfo['type'];
  public readonly description: IRequiredAdditionalInfo['description'];
  public readonly createdAt: IRequiredAdditionalInfo['createdAt'];
  public readonly competitionId: IRequiredAdditionalInfo['competitionId'];

  constructor(entity: IRequiredAdditionalInfo) {
    this.id = entity.id;
    this.type = entity.type;
    this.description = entity.description;
    this.createdAt = entity.createdAt;
    this.competitionId = entity.competitionId;
  }

  toEntity(): IRequiredAdditionalInfo {
    return {
      id: this.id,
      type: this.type,
      description: this.description,
      createdAt: this.createdAt,
      competitionId: this.competitionId,
    };
  }
}
