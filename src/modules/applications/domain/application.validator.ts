import { Injectable } from '@nestjs/common';
import { ApplicationsErrorMap, BusinessException } from 'src/common/response/errorResponse';
import { IPlayerSnapshot } from './interface/player-snapshot.interface';
import { CompetitionEntity } from 'src/modules/competitions/domain/entity/competition.entity';
import { PlayerSnapshotEntity } from './entity/player-snapshot.entity';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';

@Injectable()
export class ApplicationValidator {
  /**
   * - Validate application ability.
   * - 1. validate applicationable date.
   * - 2. validate exist divisions.
   * - 3. validate division suitable.
   *    - 3-1. validate division age.
   *    - 3-2. validate division gender.
   */
  validateApplicationAbility(
    createPlayerSnapshotDto: IPlayerSnapshot.CreateDto,
    divisionIds: IDivision['id'][],
    competition: ICompetition,
    now: Date = new Date(),
  ): void {
    this.validateApplicationPeriod(competition.registrationStartDate, competition.registrationEndDate, now);
    this.validateDivisionSuitable(createPlayerSnapshotDto, divisionIds, competition.divisions);
  }

  validateApplicationPeriod(
    registrationStartDate: CompetitionEntity['registrationStartDate'],
    registrationEndDate: CompetitionEntity['registrationEndDate'],
    now: Date = new Date(),
  ): void {
    if (registrationStartDate && now < registrationStartDate) {
      throw new BusinessException(
        ApplicationsErrorMap.APPLICATIONS_REGISTRATION_NOT_STARTED,
        `registrationStartDate: ${registrationStartDate}`,
      );
    }
    if (registrationEndDate && now > registrationEndDate) {
      throw new BusinessException(
        ApplicationsErrorMap.APPLICATIONS_REGISTRATION_ENDED,
        `registrationEndDate: ${registrationEndDate}`,
      );
    }
  }

  validateDivisionSuitable(
    createPlayerSnapshotDto: IPlayerSnapshot.CreateDto,
    particiationDivisionIds: IDivision['id'][],
    competitionDivisions: IDivision[],
  ) {
    const existDivisions = this.validateExistDivisions(particiationDivisionIds, competitionDivisions);
    existDivisions.forEach((division) => {
      this.validateDivisionAge(createPlayerSnapshotDto.birth, division);
      this.validateDivisionGender(createPlayerSnapshotDto.gender, division);
    });
  }

  validateExistDivisions(particiationDivisionIds: IDivision['id'][], competitionDivisions: IDivision[]): IDivision[] {
    const existDivisions: IDivision[] = [];
    competitionDivisions.forEach((division) => {
      if (particiationDivisionIds.includes(division.id)) {
        existDivisions.push(division);
      }
    });
    if (existDivisions.length !== particiationDivisionIds.length) {
      throw new BusinessException(
        ApplicationsErrorMap.APPLICATIONS_DIVISION_NOT_FOUND,
        `divisionIds: ${particiationDivisionIds.join(', ')}`,
      );
    }
    return existDivisions;
  }

  validateDivisionAge(playerBirth: PlayerSnapshotEntity['birth'], division: IDivision): void {
    const birthYear = +playerBirth.slice(0, 4);
    if (birthYear < +division.birthYearRangeStart || birthYear > +division.birthYearRangeEnd) {
      throw new BusinessException(
        ApplicationsErrorMap.APPLICATIONS_DIVISION_AGE_NOT_MATCH,
        `divisionId: ${division.id}, divisionBirthRangeStart: ${division.birthYearRangeStart}, divisionBirthRangeEnd: ${division.birthYearRangeEnd}, playerBirth: ${playerBirth}`,
      );
    }
  }

  validateDivisionGender(playerGender: PlayerSnapshotEntity['gender'], division: IDivision): void {
    if (division.gender === 'MIXED') return;
    if (playerGender !== division.gender) {
      throw new BusinessException(
        ApplicationsErrorMap.APPLICATIONS_DIVISION_GENDER_NOT_MATCH,
        `divisionId: ${division.id}, divisionGender: ${division.gender}, playerGender: ${playerGender}`,
      );
    }
  }
}
