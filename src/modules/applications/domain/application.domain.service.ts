import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { ApplicationRepository } from '../application.repository';
import { IApplication } from './interface/application.interface';
import { IExpectedPayment } from './interface/expected-payment.interface';
import { IEarlybirdDiscountSnapshot } from 'src/modules/competitions/domain/interface/earlybird-discount-snapshot.interface';
import { ICombinationDiscountSnapshot } from 'src/modules/competitions/domain/interface/combination-discount-snapshot.interface';
import { Injectable } from '@nestjs/common';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';

@Injectable()
export class ApplicationDomainService {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  async calculatePayment(
    application: IApplication.CalculatePayment.Application,
    competition: IApplication.CalculatePayment.Competition,
  ): Promise<IExpectedPayment> {
    // const competition = await this.applicationRepository.getCompetition(application.competitionId);

    const participationDivisionIds = application.participationDivisions.map((participationDivision) => {
      return participationDivision.participationDivisionSnapshots[
        participationDivision.participationDivisionSnapshots.length - 1
      ].divisionId;
    });

    const participationDivisions = competition.divisions.filter((division) =>
      participationDivisionIds.includes(division.id),
    );

    const normalAmount = this.calculateNormalAmount(participationDivisions);
    const earlybirdDiscountAmount = this.calculateEarlybirdDiscountAmount(
      competition.earlybirdDiscountSnapshots[competition.earlybirdDiscountSnapshots.length - 1] || null,
    );
    const combinationDiscountAmount = this.calculateCombinationDiscountAmount(
      competition.combinationDiscountSnapshots[competition.combinationDiscountSnapshots.length - 1] || null,
      participationDivisions,
    );
    const totalAmount = normalAmount - earlybirdDiscountAmount - combinationDiscountAmount;

    return { normalAmount, earlybirdDiscountAmount, combinationDiscountAmount, totalAmount };
  }

  private calculateNormalAmount(divisions: IDivision[]): number {
    return divisions.reduce((acc, division) => {
      acc += division.priceSnapshots.at(-1)?.price || 0;
      return acc;
    }, 0);
  }

  private calculateEarlybirdDiscountAmount(
    earlybirdDiscountSnapshot: IEarlybirdDiscountSnapshot,
    currentTime: Date = new Date(),
  ): number {
    if (earlybirdDiscountSnapshot === null) return 0;
    if (currentTime < earlybirdDiscountSnapshot.earlybirdStartDate) return 0;
    if (currentTime > earlybirdDiscountSnapshot.earlybirdEndDate) return 0;
    return earlybirdDiscountSnapshot.discountAmount;
  }

  private calculateCombinationDiscountAmount(
    combinationDiscountSnapshot: ICombinationDiscountSnapshot,
    divisions: IDivision[],
  ): number {
    if (combinationDiscountSnapshot === null) return 0;
    const divisionUnits = divisions.map((division) => ({
      weightType: division.weight === 'ABSOLUTE' ? 'ABSOLUTE' : 'WEIGHT',
      uniformType: division.uniform,
    }));
    let maxDiscountAmount = 0;
    for (const rule of combinationDiscountSnapshot.combinationDiscountRules) {
      const matched = rule.combination.every((unit) =>
        divisionUnits.some(
          (divisionUnit) =>
            divisionUnit.uniformType === unit.uniformType && divisionUnit.weightType === unit.weightType,
        ),
      );
      if (matched) maxDiscountAmount = Math.max(maxDiscountAmount, rule.discountAmount);
    }
    return maxDiscountAmount;
  }
}
