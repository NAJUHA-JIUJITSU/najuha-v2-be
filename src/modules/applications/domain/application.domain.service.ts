import { IExpectedPayment } from './interface/expected-payment.interface';
import { IEarlybirdDiscountSnapshot } from 'src/modules/competitions/domain/interface/earlybird-discount-snapshot.interface';
import { Injectable } from '@nestjs/common';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { IApplication } from './interface/application.interface';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { ICombinationDiscountSnapshot } from 'src/modules/competitions/domain/interface/combination-discount-snapshot.interface';

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
  async calculatePayment(application: IApplication, competition: ICompetition): Promise<IExpectedPayment> {
    if (!competition.earlybirdDiscountSnapshots) throw new Error('earlybirdDiscountSnapshots is undefined');
    if (!competition.combinationDiscountSnapshots) throw new Error('combinationDiscountSnapshots is undefined');
    if (!competition.divisions) throw new Error('divisions is undefined');

    const participationDivisionInfoIds = application.participationDivisionInfos.map((participationDivisionInfo) => {
      return participationDivisionInfo.participationDivisionInfoSnapshots[
        participationDivisionInfo.participationDivisionInfoSnapshots.length - 1
      ].participationDivisionId;
    });

    const participationDivisionInfos = competition.divisions?.filter((division) =>
      participationDivisionInfoIds.includes(division.id),
    );

    const normalAmount = this.calculateNormalAmount(participationDivisionInfos);

    const earlybirdDiscountAmount = this.calculateEarlybirdDiscountAmount(
      competition.earlybirdDiscountSnapshots[competition.earlybirdDiscountSnapshots.length - 1] || null,
    );

    const combinationDiscountAmount = this.calculateCombinationDiscountAmount(
      competition?.combinationDiscountSnapshots[competition.combinationDiscountSnapshots.length - 1] || null,
      participationDivisionInfos,
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
