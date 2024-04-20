import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { IApplication } from '../interface/application.interface';
import { IParticipationDivisionInfo } from '../interface/participation-division-info.interface';
import { IPlayerSnapshot } from '../interface/player-snapshot.interface';
import { ParticipationDivisionInfoSnapshot } from './participation-division-info-snapshot.model';
import { ApplicationsErrorMap, BusinessException } from 'src/common/response/errorResponse';
import { assert } from 'typia';

export class ParticipationDivisionInfo {
  private id: IParticipationDivisionInfo['id'];
  private createdAt: IParticipationDivisionInfo['createdAt'];
  private applicationId: IApplication['id'];
  private participationDivisionInfoSnapshots: ParticipationDivisionInfoSnapshot[];

  constructor(value: IParticipationDivisionInfo.ModelValue.Base) {
    assert<IParticipationDivisionInfo.ModelValue.Base>(value);
    this.id = value.id;
    this.createdAt = value.createdAt;
    this.applicationId = value.applicationId;
    this.participationDivisionInfoSnapshots = value.participationDivisionInfoSnapshots.map(
      (snapshot) => new ParticipationDivisionInfoSnapshot(snapshot),
    );
  }
  toModelValue(): IParticipationDivisionInfo.ModelValue.Base {
    return {
      id: this.id,
      createdAt: this.createdAt,
      applicationId: this.applicationId,
      participationDivisionInfoSnapshots: this.participationDivisionInfoSnapshots.map((snapshot) =>
        snapshot.toModelValue(),
      ),
    };
  }

  getId() {
    return this.id;
  }

  validateDivisionSuitability(playerBirth: IPlayerSnapshot['birth'], playerGender: IPlayerSnapshot['gender']) {
    const division =
      this.participationDivisionInfoSnapshots[this.participationDivisionInfoSnapshots.length - 1].division;
    this.validateDivisionAgeRange(division, playerBirth);
    this.validateDivisionGender(division, playerGender);
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

  addParticipationDivisionInfoSnapshot(snapshot: ParticipationDivisionInfoSnapshot) {
    this.participationDivisionInfoSnapshots.push(snapshot);
  }
}
