import { Injectable } from '@nestjs/common';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { ApplicationsErrorMap, BusinessException } from 'src/common/response/errorResponse';
import { IPlayerSnapshot } from './interface/player-snapshot.interface';
import { IApplication } from './interface/application.interface';

@Injectable()
export class ApplicationValidator {
  /**
   * - Validate application ability.
   * - 1. validate applicationable date.
   * - 2. validate exist divisions.
   * - 3. validate division age.
   * - 4. validate division gender.
   */
  validateApplicationAbility(
    player: IApplication.ValidateApplicationAbility.Player,
    divisionIds: IDivision['id'][],
    competition: IApplication.ValidateApplicationAbility.Competition,
    now: Date = new Date(),
  ): void {
    this.validateApplicationableDate(competition.registrationStartDate, competition.registrationEndDate, now);
    const existDivisions = this.validateExistDivisions(divisionIds, competition.divisions);
    existDivisions.forEach((division) => {
      this.validateDivisionAge(player.birth, division);
      this.validateDivisionGender(player.gender, division);
    });
  }

  validateApplicationableDate(
    registrationStartDate: IApplication.ValidateApplicationAbility.Competition['registrationStartDate'],
    registrationEndDate: IApplication.ValidateApplicationAbility.Competition['registrationEndDate'],
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

  validateExistDivisions(applicationDivisionsIds: IDivision['id'][], competitionDivisions: IDivision[]): IDivision[] {
    const existDivisions = applicationDivisionsIds.map((divisionId) => {
      const division = competitionDivisions.find((division) => division.id === divisionId);
      if (!division) {
        throw new BusinessException(ApplicationsErrorMap.APPLICATIONS_DIVISION_NOT_FOUND, `divisionId: ${divisionId}`);
      }
      return division;
    });

    return existDivisions;
  }

  validateDivisionAge(playerBirth: IPlayerSnapshot['birth'], division: IDivision): void {
    const birthYear = +playerBirth.slice(0, 4);
    if (birthYear < +division.birthYearRangeStart || birthYear > +division.birthYearRangeEnd) {
      throw new BusinessException(
        ApplicationsErrorMap.APPLICATIONS_DIVISION_AGE_NOT_MATCH,
        `divisionId: ${division.id}, divisionBirthRangeStart: ${division.birthYearRangeStart}, divisionBirthRangeEnd: ${division.birthYearRangeEnd}, playerBirth: ${playerBirth}`,
      );
    }
  }

  validateDivisionGender(playerGender: IPlayerSnapshot['gender'], division: IDivision): void {
    if (division.gender === 'MIXED') return;
    if (playerGender !== division.gender) {
      throw new BusinessException(
        ApplicationsErrorMap.APPLICATIONS_DIVISION_GENDER_NOT_MATCH,
        `divisionId: ${division.id}, divisionGender: ${division.gender}, playerGender: ${playerGender}`,
      );
    }
  }
}
