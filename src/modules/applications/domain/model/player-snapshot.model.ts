import { IApplication } from '../interface/application.interface';
import { IPlayerSnapshot } from '../interface/player-snapshot.interface';

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
  public readonly applicationId: IApplication['id'];

  constructor(props: IPlayerSnapshot) {
    this.id = props.id;
    this.name = props.name;
    this.gender = props.gender;
    this.birth = props.birth;
    this.phoneNumber = props.phoneNumber;
    this.belt = props.belt;
    this.network = props.network;
    this.team = props.team;
    this.masterName = props.masterName;
    this.createdAt = props.createdAt;
    this.applicationId = props.applicationId;
  }
}
