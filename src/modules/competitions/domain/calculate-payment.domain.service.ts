import { IExpectedPayment } from '../../applications/domain/interface/expected-payment.interface';
import { Absolute } from './interface/division.interface';
import typia from 'typia';
import { DivisionModel } from './model/division.model';
import { PriceSnapshotModel } from './model/price-snapshot.model';
import { EarlybirdDiscountSnapshotModel } from './model/earlybird-discount-snapshot.model';
import { CombinationDiscountSnapshotModel } from './model/combination-discount-snapshot.model';

export class CalculatePaymentService {
  static calculate(
    divisions: DivisionModel[],
    priceSnapshots: PriceSnapshotModel[],
    earlybirdDiscountSnapshot: EarlybirdDiscountSnapshotModel | null,
    combinationDiscountSnapshot: CombinationDiscountSnapshotModel | null,
    now: Date = new Date(),
  ): IExpectedPayment {
    const normalAmount = this.calculateNormalAmount(priceSnapshots);
    const earlybirdDiscountAmount = this.calculateEarlybirdDiscountAmount(earlybirdDiscountSnapshot, now);
    const combinationDiscountAmount = this.calculateCombinationDiscountAmount(combinationDiscountSnapshot, divisions);
    let totalAmount = normalAmount - earlybirdDiscountAmount - combinationDiscountAmount;
    if (totalAmount < 0) totalAmount = 0;
    return { normalAmount, earlybirdDiscountAmount, combinationDiscountAmount, totalAmount };
  }

  private static calculateNormalAmount(priceSnapshots: PriceSnapshotModel[]): number {
    return priceSnapshots.reduce((acc, priceSnapshot) => {
      acc += priceSnapshot.price;
      return acc;
    }, 0);
  }

  private static calculateEarlybirdDiscountAmount(
    earlybirdDiscountSnapshot: EarlybirdDiscountSnapshotModel | null,
    now: Date,
  ): number {
    if (earlybirdDiscountSnapshot === null) return 0;
    if (now < earlybirdDiscountSnapshot.earlybirdStartDate) return 0;
    if (now > earlybirdDiscountSnapshot.earlybirdEndDate) return 0;
    return earlybirdDiscountSnapshot.discountAmount;
  }

  private static calculateCombinationDiscountAmount(
    combinationDiscountSnapshot: CombinationDiscountSnapshotModel | null,
    divisions: DivisionModel[],
  ): number {
    if (combinationDiscountSnapshot === null) return 0;

    const divisionUnits = divisions.map((division) => ({
      weightType: typia.is<Absolute>(division.weight) ? 'ABSOLUTE' : 'WEIGHT',
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
