import { IDivision } from 'src/modules/competitions/domain/structure/division.interface';
import { ApplicationRepository } from '../application.repository';
import { IApplication } from './structure/application.interface';
import { IExpectedPayment } from './structure/expected-payment.interface';
import { IEarlybirdDiscountSnapshot } from 'src/modules/competitions/domain/structure/earlybird-discount-snapshot.interface';
import { ICombinationDiscountSnapshot } from 'src/modules/competitions/domain/structure/combination-discount-snapshot.interface';

export class ApplicationDomainService {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  async calculateExpectedPrice(application: IApplication): Promise<IExpectedPayment> {
    const competition = await this.applicationRepository.getCompetition(application.competitionId);

    const participationDivisionIds = application.participationDivisions.map((participationDivision) => {
      return participationDivision.participationDivisionSnapshots[
        participationDivision.participationDivisionSnapshots.length - 1
      ].divisionId;
    });

    const divisions = competition.divisions.filter((division) => participationDivisionIds.includes(division.id));

    const normalAmount = this.calculateNormalAmount(divisions);
    const earlybirdDiscountAmount = this.calculateEarlybirdDiscountAmount(
      competition.earlybirdDiscountSnapshots[competition.earlybirdDiscountSnapshots.length - 1] || null,
    );
    const combinationDiscountAmount = this.calculateCombinationDiscountAmount(
      competition.combinationDiscountSnapshots[competition.combinationDiscountSnapshots.length - 1] || null,
      divisions,
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
      weight: division.weight === 'ABSOLUTE' ? 'ABSOLUTE' : 'WEIGHT',
      uniform: division.uniform,
    }));
    let maxDiscountAmount = 0;
    for (const rule of combinationDiscountSnapshot.combinationDiscountRules) {
      const matched = rule.combination.every((unit) =>
        divisionUnits.some(
          (divisionUnit) => divisionUnit.uniform === unit.uniform && divisionUnit.weight === unit.weight,
        ),
      );
      if (matched) maxDiscountAmount = Math.max(maxDiscountAmount, rule.discountAmount);
    }
    return maxDiscountAmount;
  }
}

//   calculateExpectedPayment(divisionIds: Division['id'][]): IExpectedPayment {
//     const divisions = this.divisions.filter((division) => divisionIds.includes(division.id));
//     const normalAmount = this.calculateNormalAmount(divisions);
//     const earlybirdDiscountAmount = this.calculateEarlybirdDiscountAmount(
//       this.earlybirdDiscountSnapshots[this.earlybirdDiscountSnapshots.length - 1] || null,
//     );
//     const combinationDiscountAmount = this.calculateCombinationDiscountAmount(
//       this.combinationDiscountSnapshots[this.combinationDiscountSnapshots.length - 1] || null,
//       divisions,
//     );
//     const totalAmount = normalAmount - earlybirdDiscountAmount - combinationDiscountAmount;
//     return { normalAmount, earlybirdDiscountAmount, combinationDiscountAmount, totalAmount };
//   }

//   private calculateNormalAmount(divisions: Division[]): number {
//     return divisions.reduce((acc, division) => {
//       acc += division.priceSnapshots.at(-1)?.price || 0;
//       return acc;
//     }, 0);
//   }

//   private calculateEarlybirdDiscountAmount(
//     earlybirdDiscountSnapshot: EarlybirdDiscountSnapshot,
//     currentTime: Date = new Date(),
//   ): number {
//     if (earlybirdDiscountSnapshot === null) return 0;
//     if (currentTime < earlybirdDiscountSnapshot.earlybirdStartDate) return 0;
//     if (currentTime > earlybirdDiscountSnapshot.earlybirdEndDate) return 0;
//     return earlybirdDiscountSnapshot.discountAmount;
//   }

//   private calculateCombinationDiscountAmount(
//     combinationDiscountSnapshot: CombinationDiscountSnapshot,
//     divisions: Division[],
//   ): number {
//     if (combinationDiscountSnapshot === null) return 0;
//     const divisionUnits = divisions.map((division) => ({
//       weight: division.weight === 'ABSOLUTE' ? 'ABSOLUTE' : 'WEIGHT',
//       uniform: division.uniform,
//     }));
//     let maxDiscountAmount = 0;
//     for (const rule of combinationDiscountSnapshot.combinationDiscountRules) {
//       const matched = rule.combination.every((unit) =>
//         divisionUnits.some(
//           (divisionUnit) => divisionUnit.uniform === unit.uniform && divisionUnit.weight === unit.weight,
//         ),
//       );
//       if (matched) maxDiscountAmount = Math.max(maxDiscountAmount, rule.discountAmount);
//     }
//     return maxDiscountAmount;
//   }
