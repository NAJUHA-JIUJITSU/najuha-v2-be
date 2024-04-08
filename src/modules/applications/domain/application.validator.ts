import { Injectable } from '@nestjs/common';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { ApplicationsErrorMap, BusinessException } from 'src/common/response/errorResponse';
import { IPlayerSnapshot } from './interface/player-snapshot.interface';
import { IApplication } from './interface/application.interface';

@Injectable()
export class ApplicationValidator {
  // validateRegisterEndDate(competition: ICompetition): void {
  //   if (new Date(competition.registrationEndDate) < new Date()) {
  //     throw new BusinessException(ApplicationsErrorMap.APPLICATIONS_REGISTER_END_DATE_EXPIRED);
  //   }
  // }

  checkDivisionSuitability(
    divisionIds: IDivision['id'][],
    player: IApplication.Create.Player,
    competition: IApplication.Create.Competition,
  ): void {
    const existDivisions = this.validateExistDivisions(divisionIds, competition.divisions);
    existDivisions.forEach((division) => {
      this.validateDivisionAge(player.birth, division);
      this.validateDivisionGender(player.gender, division);
    });
  }

  private validateExistDivisions(
    applicationDivisionsIds: IDivision['id'][],
    competitionDivisions: IDivision[],
  ): IDivision[] {
    const existDivisions = applicationDivisionsIds.map((divisionId) => {
      const division = competitionDivisions.find((division) => division.id === divisionId);
      if (!division) {
        throw new BusinessException(ApplicationsErrorMap.APPLICATIONS_DIVISION_NOT_FOUND, `divisionId: ${divisionId}`);
      }
      return division;
    });

    return existDivisions;
  }

  private validateDivisionAge(playerBirth: IPlayerSnapshot['birth'], division: IDivision): void {
    const birthYear = +playerBirth.slice(0, 4);
    if (birthYear < +division.birthYearRangeStart || birthYear > +division.birthYearRangeEnd) {
      throw new BusinessException(
        ApplicationsErrorMap.APPLICATIONS_DIVISION_AGE_NOT_MATCH,
        `divisionId: ${division.id}, divisionBirthRangeStart: ${division.birthYearRangeStart}, divisionBirthRangeEnd: ${division.birthYearRangeEnd}, playerBirth: ${playerBirth}`,
      );
    }
  }

  private validateDivisionGender(playerGender: IPlayerSnapshot['gender'], division: IDivision): void {
    if (division.gender === 'MIXED') return;
    if (playerGender !== division.gender) {
      throw new BusinessException(
        ApplicationsErrorMap.APPLICATIONS_DIVISION_GENDER_NOT_MATCH,
        `divisionId: ${division.id}, divisionGender: ${division.gender}, playerGender: ${playerGender}`,
      );
    }
  }
}
