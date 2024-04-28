import { IRequiredAddtionalInfo } from '../interface/required-addtional-info.interface';

export class RequiredAddtionalInfoModel {
  public readonly id: IRequiredAddtionalInfo['id'];
  public readonly type: IRequiredAddtionalInfo['type'];
  public readonly description: IRequiredAddtionalInfo['description'];
  public readonly createdAt: IRequiredAddtionalInfo['createdAt'];
  public readonly competitionId: IRequiredAddtionalInfo['competitionId'];

  constructor(entity: IRequiredAddtionalInfo) {
    this.id = entity.id;
    this.type = entity.type;
    this.description = entity.description;
    this.createdAt = entity.createdAt;
    this.competitionId = entity.competitionId;
  }

  toEntity(): IRequiredAddtionalInfo {
    return {
      id: this.id,
      type: this.type,
      description: this.description,
      createdAt: this.createdAt,
      competitionId: this.competitionId,
    };
  }
}
