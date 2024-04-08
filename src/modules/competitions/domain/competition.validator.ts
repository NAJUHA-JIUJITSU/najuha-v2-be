import { Injectable } from '@nestjs/common';
import { ICompetition } from './interface/competition.interface';
import { BusinessException, CompetitionsErrorMap } from 'src/common/response/errorResponse';
import { IDivision } from './interface/division.interface';

@Injectable()
export class CompetitionValidator {
  constructor() {}

  validateCanBeActive(competition: ICompetition): void {
    const missingProperties: string[] = [];
    if (competition.title === 'DEFAULT TITLE') missingProperties.push('title');
    if (competition.address === 'DEFAULT ADDRESS') missingProperties.push('address');
    if (competition.competitionDate === null) missingProperties.push('competitionDate');
    if (competition.registrationStartDate === null) missingProperties.push('registrationStartDate');
    if (competition.registrationEndDate === null) missingProperties.push('registrationEndDate');
    if (competition.description === 'DEFAULT DESCRIPTION') missingProperties.push('description');

    if (missingProperties.length > 0) {
      throw new BusinessException(
        CompetitionsErrorMap.COMPETITIONS_COMPETITION_STATUS_CANNOT_BE_ACTIVE,
        `다음 항목을 작성해주세요: ${missingProperties.join(', ')}`,
      );
    }
  }

  validateDuplicateDivisions(competition: ICompetition.CreateDivisions.Competition, newDivisions: IDivision[]): void {
    const duplicatedDivisions = competition.divisions.filter((division) => {
      return newDivisions.some(
        (newDivision) =>
          newDivision.category === division.category &&
          newDivision.uniform === division.uniform &&
          newDivision.gender === division.gender &&
          newDivision.belt === division.belt &&
          newDivision.weight === division.weight,
      );
    });
    if (duplicatedDivisions.length > 0) {
      throw new BusinessException(
        CompetitionsErrorMap.COMPETITIONS_DIVISION_DUPLICATED,
        `${duplicatedDivisions
          .map(
            (division) =>
              `${division.category} ${division.uniform} ${division.gender} ${division.belt} ${division.weight}`,
          )
          .join(', ')}`,
      );
    }
  }
}
