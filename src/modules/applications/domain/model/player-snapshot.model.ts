import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { IApplication } from '../interface/application.interface';
import { IPlayerSnapshot } from '../interface/player-snapshot.interface';
import { assert } from 'typia';

export class PlayerSnapshot {
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
  public readonly applicationId: IApplication['id'];

  constructor(entity: IPlayerSnapshot.Entity.Base) {
    assert<IPlayerSnapshot.Entity.Base>(entity);
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

  toEntity(): IPlayerSnapshot.Entity.Base {
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

  validateSelfApplication(userEntity: IUser.Entity.User) {
    const mismatchs: string[] = [];
    if (this.name !== userEntity.name) mismatchs.push('name');
    if (this.phoneNumber !== userEntity.phoneNumber) mismatchs.push('phoneNumber');
    if (this.birth !== userEntity.birth) mismatchs.push('birth');
    if (this.gender !== userEntity.gender) mismatchs.push('gender');
    // TODO: 에러 표준화
    if (mismatchs.length > 0) throw new Error(`Mismatched fields: ${mismatchs.join(', ')}`);
  }
}
