import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { ApplicationRepository } from '../application.repository';
import { IApplication } from './interface/application.interface';
import { IExpectedPayment } from './interface/expected-payment.interface';
import { IEarlybirdDiscountSnapshot } from 'src/modules/competitions/domain/interface/earlybird-discount-snapshot.interface';
import { ICombinationDiscountSnapshot } from 'src/modules/competitions/domain/interface/combination-discount-snapshot.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ApplicationDomainService {
  /**
   * - Calculate payment.
   * - 1. calculate normal amount.
   * - 2. calculate earlybird discount amount.
   * - 3. calculate combination discount amount.
   * - 4. calculate total amount.
   *
   * @param application
   * @param competition
   * @returns IExpectedPayment
   */
  async calculatePayment(
    application: IApplication.CalculatePayment.Application,
    competition: IApplication.CalculatePayment.Competition,
  ): Promise<IExpectedPayment> {
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

  /**
   * - Calculate normal amount.
   *
   * @param divisions
   * @returns normal amount
   */
  private calculateNormalAmount(divisions: IDivision[]): number {
    return divisions.reduce((acc, division) => {
      acc += division.priceSnapshots[division.priceSnapshots.length - 1].price || 0;
      return acc;
    }, 0);
  }

  /**
   * - Calculate earlybird discount amount.
   *
   * @param earlybirdDiscountSnapshot
   * @param now default new Date()
   * @returns earlybird discount amount
   */
  private calculateEarlybirdDiscountAmount(
    earlybirdDiscountSnapshot: IEarlybirdDiscountSnapshot,
    now: Date = new Date(),
  ): number {
    if (earlybirdDiscountSnapshot === null) return 0;
    if (now < earlybirdDiscountSnapshot.earlybirdStartDate) return 0;
    if (now > earlybirdDiscountSnapshot.earlybirdEndDate) return 0;
    return earlybirdDiscountSnapshot.discountAmount;
  }

  /**
   * - Calculate combination discount amount.
   *
   * @param combinationDiscountSnapshot
   * @param divisions
   * @returns combination discount amount
   */
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
