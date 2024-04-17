import { IApplication } from '../interface/application.interface';
import { PlayerSnapshotModel } from './player-snapshot.model';
import { ParticipationDivisionInfoModel } from './participation-division-info.model';
import { ParticipationDivisionInfoSnapshotModel } from './participation-division-info-snapshot.model';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { ApplicationsErrorMap, BusinessException } from 'src/common/response/errorResponse';
import { IPlayerSnapshot } from '../interface/player-snapshot.interface';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';

export class ApplicationModel {
  public id: IApplication['id'];
  public userId: IApplication['userId'];
  public competitionId: IApplication['competitionId'];
  public createdAt: IApplication['createdAt'];
  public updatedAt: IApplication['updatedAt'];
  public type: IApplication['type'];
  public status: IApplication['status'];
  public playerSnapshots: PlayerSnapshotModel[];
  public participationDivisionInfos: ParticipationDivisionInfoModel[];

  constructor(props: IApplication) {
    this.id = props.id;
    this.type = props.type;
    this.userId = props.userId;
    this.competitionId = props.competitionId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.status = props.status;
    this.playerSnapshots = props.playerSnapshots.map((snapshot) => new PlayerSnapshotModel(snapshot));
    this.participationDivisionInfos = props.participationDivisionInfos.map(
      (info) => new ParticipationDivisionInfoModel(info),
    );
  }

  validateApplicationType(user: IUser) {
    if (this.type === 'PROXY') return;
    const player = this.playerSnapshots[this.playerSnapshots.length - 1];
    const mismatchs: string[] = [];
    if (player.name !== user.name) mismatchs.push('name');
    if (player.phoneNumber !== user.phoneNumber) mismatchs.push('phoneNumber');
    if (player.birth !== user.birth) mismatchs.push('birth');
    if (player.gender !== user.gender) mismatchs.push('gender');
    // TODO: 에러 표준화
    if (mismatchs.length > 0) throw new Error(`Mismatched fields: ${mismatchs.join(', ')}`);
  }
  validateDivisionSuitability() {
    const player = this.playerSnapshots[this.playerSnapshots.length - 1];
    this.participationDivisionInfos.forEach((participationDivisionInfo) => {
      const participationDivisionInfoSnapshot =
        participationDivisionInfo.participationDivisionInfoSnapshots[
          participationDivisionInfo.participationDivisionInfoSnapshots.length - 1
        ];
      const division = participationDivisionInfoSnapshot.division;
      this.validateDivisionAgeRange(division, player.birth);
      this.validateDivisionGender(division, player.gender);
    });
  }

  private validateDivisionAgeRange(division: IDivision, playerBirth: IPlayerSnapshot['birth']) {
    const parsedBirthYear = +playerBirth.slice(0, 4);
    if (parsedBirthYear < +division.birthYearRangeStart || parsedBirthYear > +division.birthYearRangeEnd) {
      throw new BusinessException(
        ApplicationsErrorMap.APPLICATIONS_DIVISION_AGE_NOT_MATCH,
        `divisionId: ${division.id}, division: ${division.category} ${division.uniform} ${division.gender} ${division.belt} ${division.weight} ${division.birthYearRangeStart}~${division.birthYearRangeEnd}, playerBirth: ${playerBirth}`,
      );
    }
  }

  private validateDivisionGender(division: IDivision, playerGender: IPlayerSnapshot['gender']) {
    if (division.gender !== 'MIXED' && playerGender !== division.gender) {
      throw new BusinessException(
        ApplicationsErrorMap.APPLICATIONS_DIVISION_GENDER_NOT_MATCH,
        `divisionId: ${division.id}, division: ${division.category} ${division.uniform} ${division.gender} ${division.belt} ${division.weight} ${division.birthYearRangeStart}~${division.birthYearRangeEnd}, playerGender: ${playerGender}`,
      );
    }
  }

  updateStatusToDeleted() {
    if (this.status !== 'READY') throw new Error('Only READY application can be deleted');
    this.status = 'DELETED';
  }

  addPlayerSnapshot(newPlayerSnapshot: PlayerSnapshotModel) {
    if (this.status !== 'DONE') throw new Error('Only DONE application can add player snapshot');
    this.playerSnapshots.push(newPlayerSnapshot);
  }

  addParticipationDivisionInfoSnapshots(
    newParticipationDivisionInfoSnapshots: ParticipationDivisionInfoSnapshotModel[],
  ) {
    if (this.status !== 'DONE') throw new Error('Only DONE application can add participation division info snapshots');
    newParticipationDivisionInfoSnapshots.forEach((newSnapshot) => {
      const participationDivisionInfo = this.participationDivisionInfos.find(
        (participationDivisionInfo) => participationDivisionInfo.id === newSnapshot.participationDivisionInfoId,
      );
      if (!participationDivisionInfo) return; //TODO throw error
      participationDivisionInfo.participationDivisionInfoSnapshots.push(newSnapshot);
    });
  }
}
