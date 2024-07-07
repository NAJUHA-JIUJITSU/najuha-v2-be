import { IPlayerSnapshotModelData } from '../interface/player-snapshot.interface';
import { ApplicationsErrors, BusinessException } from '../../../../common/response/errorResponse';
import { UserModel } from '../../../users/domain/model/user.model';

export class PlayerSnapshotModel {
  /** properties */
  private readonly _id: IPlayerSnapshotModelData['id'];
  private readonly _name: IPlayerSnapshotModelData['name'];
  private readonly _gender: IPlayerSnapshotModelData['gender'];
  private readonly _birth: IPlayerSnapshotModelData['birth'];
  private readonly _phoneNumber: IPlayerSnapshotModelData['phoneNumber'];
  private readonly _belt: IPlayerSnapshotModelData['belt'];
  private readonly _network: IPlayerSnapshotModelData['network'];
  private readonly _team: IPlayerSnapshotModelData['team'];
  private readonly _masterName: IPlayerSnapshotModelData['masterName'];
  private readonly _createdAt: IPlayerSnapshotModelData['createdAt'];
  private readonly _applicationId: IPlayerSnapshotModelData['applicationId'];

  constructor(entity: IPlayerSnapshotModelData) {
    this._id = entity.id;
    this._name = entity.name;
    this._gender = entity.gender;
    this._birth = entity.birth;
    this._phoneNumber = entity.phoneNumber;
    this._belt = entity.belt;
    this._network = entity.network;
    this._team = entity.team;
    this._masterName = entity.masterName;
    this._createdAt = entity.createdAt;
    this._applicationId = entity.applicationId;
  }

  toData(): IPlayerSnapshotModelData {
    return {
      id: this._id,
      name: this._name,
      gender: this._gender,
      birth: this._birth,
      phoneNumber: this._phoneNumber,
      belt: this._belt,
      network: this._network,
      team: this._team,
      masterName: this._masterName,
      createdAt: this._createdAt,
      applicationId: this._applicationId,
    };
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get gender() {
    return this._gender;
  }

  get birth() {
    return this._birth;
  }

  get phoneNumber() {
    return this._phoneNumber;
  }

  get belt() {
    return this._belt;
  }

  get network() {
    return this._network;
  }

  get team() {
    return this._team;
  }

  get masterName() {
    return this._masterName;
  }

  get createdAt() {
    return this._createdAt;
  }

  get applicationId() {
    return this._applicationId;
  }

  validateSelfApplication(user: UserModel) {
    const mismatches: string[] = [];
    if (this._name !== user.name) mismatches.push('name');
    if (this._phoneNumber !== user.phoneNumber) mismatches.push('phoneNumber');
    if (this._birth !== user.birth) mismatches.push('birth');
    if (this._gender !== user.gender) mismatches.push('gender');
    if (mismatches.length > 0) {
      throw new BusinessException(
        ApplicationsErrors.APPLICATIONS_SELF_APPLICATION_NOT_ALLOWED,
        `불일치된 정보: ${mismatches.join(', ')}`,
      );
    }
  }
}
