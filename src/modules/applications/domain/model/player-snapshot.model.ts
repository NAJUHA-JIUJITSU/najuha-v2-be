import { IUser, IUserModelData } from '../../../users/domain/interface/user.interface';
import { IPlayerSnapshot } from '../interface/player-snapshot.interface';
import { ApplicationsErrors, BusinessException } from '../../../../common/response/errorResponse';

export class PlayerSnapshotModel {
  public readonly id: IPlayerSnapshot['id'];
  public readonly name: IPlayerSnapshot['name'];
  public readonly gender: IPlayerSnapshot['gender'];
  public readonly birth: IPlayerSnapshot['birth'];
  public readonly phoneNumber: IPlayerSnapshot['phoneNumber'];
  public readonly belt: IPlayerSnapshot['belt'];
  public readonly network: IPlayerSnapshot['network'];
  public readonly team: IPlayerSnapshot['team'];
  public readonly masterName: IPlayerSnapshot['masterName'];
  public readonly createdAt: IPlayerSnapshot['createdAt'];
  public readonly applicationId: IPlayerSnapshot['applicationId'];

  constructor(entity: IPlayerSnapshot) {
    this.id = entity.id;
    this.name = entity.name;
    this.gender = entity.gender;
    this.birth = entity.birth;
    this.phoneNumber = entity.phoneNumber;
    this.belt = entity.belt;
    this.network = entity.network;
    this.team = entity.team;
    this.masterName = entity.masterName;
    this.createdAt = entity.createdAt;
    this.applicationId = entity.applicationId;
  }

  toData(): IPlayerSnapshot {
    return {
      id: this.id,
      name: this.name,
      gender: this.gender,
      birth: this.birth,
      phoneNumber: this.phoneNumber,
      belt: this.belt,
      network: this.network,
      team: this.team,
      masterName: this.masterName,
      createdAt: this.createdAt,
      applicationId: this.applicationId,
    };
  }

  validateSelfApplication(userEntity: IUserModelData) {
    const mismatchs: string[] = [];
    if (this.name !== userEntity.name) mismatchs.push('name');
    if (this.phoneNumber !== userEntity.phoneNumber) mismatchs.push('phoneNumber');
    if (this.birth !== userEntity.birth) mismatchs.push('birth');
    if (this.gender !== userEntity.gender) mismatchs.push('gender');
    if (mismatchs.length > 0)
      throw new BusinessException(
        ApplicationsErrors.APPLICATIONS_SELF_APPLICATION_NOT_ALLOWED,
        `불일치된 정보: ${mismatchs.join(', ')}`,
      );
  }
}
