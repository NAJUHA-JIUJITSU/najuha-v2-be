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

  constructor(playerSnapshot: PlayerSnapshotModel) {
    this.id = playerSnapshot.id;
    this.name = playerSnapshot.name;
    this.gender = playerSnapshot.gender;
    this.birth = playerSnapshot.birth;
    this.phoneNumber = playerSnapshot.phoneNumber;
    this.belt = playerSnapshot.belt;
    this.network = playerSnapshot.network;
    this.team = playerSnapshot.team;
    this.masterName = playerSnapshot.masterName;
    this.createdAt = playerSnapshot.createdAt;
    this.applicationId = playerSnapshot.applicationId;
  }
}
