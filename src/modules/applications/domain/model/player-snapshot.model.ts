import { IPlayerSnapshotModelData } from '../interface/player-snapshot.interface';
import { ApplicationsErrors, BusinessException } from '../../../../common/response/errorResponse';
import { UserModel } from '../../../users/domain/model/user.model';

export class PlayerSnapshotModel {
  public readonly id: IPlayerSnapshotModelData['id'];
  public readonly name: IPlayerSnapshotModelData['name'];
  public readonly gender: IPlayerSnapshotModelData['gender'];
  public readonly birth: IPlayerSnapshotModelData['birth'];
  public readonly phoneNumber: IPlayerSnapshotModelData['phoneNumber'];
  public readonly belt: IPlayerSnapshotModelData['belt'];
  public readonly network: IPlayerSnapshotModelData['network'];
  public readonly team: IPlayerSnapshotModelData['team'];
  public readonly masterName: IPlayerSnapshotModelData['masterName'];
  public readonly createdAt: IPlayerSnapshotModelData['createdAt'];
  public readonly applicationId: IPlayerSnapshotModelData['applicationId'];

  constructor(entity: IPlayerSnapshotModelData) {
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

  toData(): IPlayerSnapshotModelData {
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

  validateSelfApplication(user: UserModel) {
    const mismatchs: string[] = [];
    if (this.name !== user.getName()) mismatchs.push('name');
    if (this.phoneNumber !== user.getPhoneNumber()) mismatchs.push('phoneNumber');
    if (this.birth !== user.getBirth()) mismatchs.push('birth');
    if (this.gender !== user.getGender()) mismatchs.push('gender');
    if (mismatchs.length > 0)
      throw new BusinessException(
        ApplicationsErrors.APPLICATIONS_SELF_APPLICATION_NOT_ALLOWED,
        `불일치된 정보: ${mismatchs.join(', ')}`,
      );
  }
}
