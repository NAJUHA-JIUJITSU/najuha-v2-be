import { Injectable } from '@nestjs/common';
import { CreateApplicationReqDto } from '../dto/request/create-application.req.dto';
import { ICompetition } from 'src/modules/competitions/domain/structure/competition.interface';
import { IDivision } from 'src/modules/competitions/domain/structure/division.interface';
import { ApplicationsErrorMap, BusinessException } from 'src/common/response/errorResponse';

@Injectable()
export class ApplicationValidator {
  async validateApplication(dto: CreateApplicationReqDto, competition: ICompetition): Promise<void> {
    this.validateExistDivisions(dto.divisionIds, competition.divisions);

    // TODO: implement this
    this.validateAge();
    this.validateGender();
  }

  private validateExistDivisions(applicationDivisionsIds: IDivision['id'][], competitionDivisions: IDivision[]): void {
    const notExistDivisions = applicationDivisionsIds.filter(
      (divisionId) => !competitionDivisions.some((division) => division.id === divisionId),
    );
    if (notExistDivisions.length > 0) {
      throw new BusinessException(
        ApplicationsErrorMap.APPLICATIONS_DIVISION_NOT_FOUND,
        `not found divisionIds: ${notExistDivisions.join(', ')}`,
      );
    }
  }
  private validateAge(): void {}
  private validateGender(): void {}
}
