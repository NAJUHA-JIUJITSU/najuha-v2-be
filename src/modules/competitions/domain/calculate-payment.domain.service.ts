import { IExpectedPayment } from '../../applications/domain/interface/expected-payment.interface';
import { ICombinationDiscountSnapshot } from './interface/combination-discount-snapshot.interface';
import { Absolute, IDivision } from './interface/division.interface';
import { IEarlybirdDiscountSnapshot } from './interface/earlybird-discount-snapshot.interface';
import { IPriceSnapshot } from './interface/price-snapshot.interface';
import typia from 'typia';

export class CalculatePaymentService {
  static calculate(
    divisions: IDivision[],
    priceSnapshots: IPriceSnapshot[],
    earlybirdDiscountSnapshot: IEarlybirdDiscountSnapshot | null,
    combinationDiscountSnapshot: ICombinationDiscountSnapshot | null,
    now: Date = new Date(),
  ): IExpectedPayment {
    const normalAmount = this.calculateNormalAmount(priceSnapshots);
    const earlybirdDiscountAmount = this.calculateEarlybirdDiscountAmount(earlybirdDiscountSnapshot, now);
    const combinationDiscountAmount = this.calculateCombinationDiscountAmount(combinationDiscountSnapshot, divisions);
    const totalAmount = normalAmount - earlybirdDiscountAmount - combinationDiscountAmount;
    return { normalAmount, earlybirdDiscountAmount, combinationDiscountAmount, totalAmount };
  }

  private static calculateNormalAmount(priceSnapshots: IPriceSnapshot[]): number {
    return priceSnapshots.reduce((acc, priceSnapshot) => {
      acc += priceSnapshot.price || 0;
      return acc;
    }, 0);
  }

  private static calculateEarlybirdDiscountAmount(
    earlybirdDiscountSnapshot: IEarlybirdDiscountSnapshot | null,
    now: Date,
  ): number {
    if (earlybirdDiscountSnapshot === null) return 0;
    if (now < earlybirdDiscountSnapshot.earlybirdStartDate) return 0;
    if (now > earlybirdDiscountSnapshot.earlybirdEndDate) return 0;
    return earlybirdDiscountSnapshot.discountAmount;
  }

  private static calculateCombinationDiscountAmount(
    combinationDiscountSnapshot: ICombinationDiscountSnapshot | null,
    divisions: IDivision[],
  ): number {
    // todo!!: 더 읽기 편하게 리팩토링
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
