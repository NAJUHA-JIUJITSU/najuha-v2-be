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

  constructor(value: IPlayerSnapshot.ModelValue.Base) {
    assert<IPlayerSnapshot.ModelValue.Base>(value);
    this.id = value.id;
    this.name = value.name;
    this.gender = value.gender;
    this.birth = value.birth;
    this.phoneNumber = value.phoneNumber;
    this.belt = value.belt;
    this.network = value.network;
    this.team = value.team;
    this.masterName = value.masterName;
    this.createdAt = value.createdAt;
    this.applicationId = value.applicationId;
  }

  toModelValue(): IPlayerSnapshot.ModelValue.Base {
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

  validateSelfApplication(userValue: IUser) {
    const mismatchs: string[] = [];
    if (this.name !== userValue.name) mismatchs.push('name');
    if (this.phoneNumber !== userValue.phoneNumber) mismatchs.push('phoneNumber');
    if (this.birth !== userValue.birth) mismatchs.push('birth');
    if (this.gender !== userValue.gender) mismatchs.push('gender');
    // TODO: 에러 표준화
    if (mismatchs.length > 0) throw new Error(`Mismatched fields: ${mismatchs.join(', ')}`);
  }
}
