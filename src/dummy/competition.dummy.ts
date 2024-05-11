import { DateTime } from 'src/common/date-time';
import { DivisionFactory } from 'src/modules/competitions/domain/division.factory';
import { ICombinationDiscountSnapshot } from 'src/modules/competitions/domain/interface/combination-discount-snapshot.interface';
import {
  CompetitionLocationFilter,
  CompetitionStatus,
  ICompetition,
} from 'src/modules/competitions/domain/interface/competition.interface';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { IEarlybirdDiscountSnapshot } from 'src/modules/competitions/domain/interface/earlybird-discount-snapshot.interface';
import { IRequiredAdditionalInfo } from 'src/modules/competitions/domain/interface/required-addtional-info.interface';
import typia, { tags } from 'typia';
import { ulid } from 'ulid';
import { generateDummyDivisionPacks } from './division.dummy';
import { dummyCombinationDiscountRules } from './combination-discount-snapshot.dummy';
import { ICombinationDiscountRule } from 'src/modules/competitions/domain/interface/combination-discount-rule.interface';

export class CompetitionDummyBuilder {
  private competition: ICompetition = {
    id: ulid(),
    title: 'Dummy Competition',
    address: typia.random<CompetitionLocationFilter>(),
    description: 'Dummy Competition Description',
    isPartnership: true,
    viewCount: typia.random<number & tags.Type<'uint32'> & tags.Minimum<0> & tags.Maximum<1000>>(),
    posterImgUrlKey: null,
    status: 'ACTIVE',
    competitionDate: null,
    registrationStartDate: null,
    registrationEndDate: null,
    refundDeadlineDate: null,
    soloRegistrationAdjustmentStartDate: null,
    soloRegistrationAdjustmentEndDate: null,
    registrationListOpenDate: null,
    bracketOpenDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    divisions: [],
    earlybirdDiscountSnapshots: [],
    combinationDiscountSnapshots: [],
    requiredAdditionalInfos: [],
  };
  private today: Date;
  private basicPeriodTitle = '';
  private earlybirdDiscountTitle = '';
  private combinationDiscountTitle = '';
  private additionalInfoTitle = '';

  constructor(today: Date = new Date()) {
    this.today = today;
  }

  public setTitle(title: string): this {
    this.competition.title = title;
    return this;
  }

  public setAddress(address: CompetitionLocationFilter): this {
    this.competition.address = address;
    return this;
  }

  public setCompetitionDates(date: Date): this {
    this.generateCompetitionDates(date);
    this.setBasicPeriodTitle();
    return this;
  }

  public setDescription(description: string): this {
    this.competition.description = description;
    return this;
  }

  public setIsPartnership(isPartnership: boolean): this {
    this.competition.isPartnership = isPartnership;
    return this;
  }

  public setViewCount(viewCount: number): this {
    this.competition.viewCount = viewCount;
    return this;
  }

  public setPosterImgUrlKey(url: string): this {
    this.competition.posterImgUrlKey = url;
    return this;
  }

  public setStatus(status: CompetitionStatus): this {
    this.competition.status = status;
    return this;
  }

  public setDivisions(divisions: IDivision[]): this {
    this.competition.divisions = divisions.map((division) => {
      return { ...division, competitionId: this.competition.id };
    });
    return this;
  }

  public setEarlybirdDiscountSnapshots(discountAmount: number): this {
    if (!this.competition.registrationStartDate || !this.competition.registrationEndDate)
      throw new Error('setEarlybirdDiscountSnapshots: registrationStartDate or registrationEndDate is null');
    const snapshot: IEarlybirdDiscountSnapshot = {
      id: ulid(),
      earlybirdStartDate: DateTime.fromJSDate(new Date(this.competition.registrationStartDate))
        .set({ hour: 0, minute: 0, second: 0 })
        .toJSDate(),
      earlybirdEndDate: DateTime.fromJSDate(new Date(this.competition.registrationEndDate))
        .minus({ days: 7 })
        .set({ hour: 23, minute: 59, second: 59 })
        .toJSDate(),
      discountAmount,
      createdAt: this.competition.createdAt,
      competitionId: this.competition.id,
    };
    this.competition.earlybirdDiscountSnapshots = [snapshot];
    this.setEarlybirdDiscountTitle();
    return this;
  }

  public setCombinationDiscountSnapshots(dummyCombinationDiscountRules: ICombinationDiscountRule[]): this {
    const snapshot: ICombinationDiscountSnapshot = {
      id: ulid(),
      combinationDiscountRules: dummyCombinationDiscountRules,
      createdAt: this.competition.createdAt,
      competitionId: this.competition.id,
    };
    this.competition.combinationDiscountSnapshots = [snapshot];
    this.setCombinationDiscountTitle();
    return this;
  }

  public setRequiredAdditionalInfos(): this {
    const dummyRequiredAdditionalInfos: IRequiredAdditionalInfo[] = [
      {
        id: ulid(),
        type: 'ADDRESS',
        description: '지역구 주짓수대회 인구조사를 위한 주소 요청',
        createdAt: this.competition.createdAt,
        deletedAt: null,
        competitionId: this.competition.id,
      },
      {
        id: ulid(),
        type: 'SOCIAL_SECURITY_NUMBER',
        description: '지역구 주짓수대회 인구조사를 위한 주민번호 요청',
        createdAt: this.competition.createdAt,
        deletedAt: null,
        competitionId: this.competition.id,
      },
    ];
    this.competition.requiredAdditionalInfos = dummyRequiredAdditionalInfos;
    this.setAdditionalInfoTitle();
    return this;
  }

  private generateCompetitionDates(baseDate: Date): void {
    const base = DateTime.fromJSDate(baseDate);

    const competitionDate = base.set({ hour: 23, minute: 59, second: 59 }).toJSDate();
    const registrationStartDate = base.minus({ days: 50 }).set({ hour: 0, minute: 0, second: 0 }).toJSDate();
    const registrationEndDate = base.minus({ days: 14 }).set({ hour: 23, minute: 59, second: 59 }).toJSDate();
    const refundDeadlineDate = base.minus({ days: 14 }).set({ hour: 23, minute: 59, second: 59 }).toJSDate();
    const soloRegistrationAdjustmentStartDate = DateTime.fromJSDate(registrationEndDate)
      .plus({ days: 1 })
      .set({ hour: 0, minute: 0, second: 0 })
      .toJSDate();
    const soloRegistrationAdjustmentEndDate = DateTime.fromJSDate(soloRegistrationAdjustmentStartDate)
      .plus({ days: 2 })
      .set({ hour: 23, minute: 59, second: 59 })
      .toJSDate();
    const registrationListOpenDate = DateTime.fromJSDate(registrationEndDate)
      .minus({ days: 7 })
      .set({ hour: 0, minute: 0, second: 0 })
      .toJSDate();
    const bracketOpenDate = DateTime.fromJSDate(registrationEndDate)
      .plus({ days: 3 })
      .set({ hour: 0, minute: 0, second: 0 })
      .toJSDate();

    this.competition.competitionDate = competitionDate;
    this.competition.registrationStartDate = registrationStartDate;
    this.competition.registrationEndDate = registrationEndDate;
    this.competition.refundDeadlineDate = refundDeadlineDate;
    this.competition.soloRegistrationAdjustmentStartDate = soloRegistrationAdjustmentStartDate;
    this.competition.soloRegistrationAdjustmentEndDate = soloRegistrationAdjustmentEndDate;
    this.competition.registrationListOpenDate = registrationListOpenDate;
    this.competition.bracketOpenDate = bracketOpenDate;
  }

  private setBasicPeriodTitle(): void {
    const details: string[] = [];
    const divider = ', ';

    if (this.competition.registrationStartDate !== null && this.competition.registrationEndDate !== null) {
      if (this.today < this.competition.registrationStartDate) {
        details.push('신청기간 전');
      } else if (
        this.competition.registrationStartDate <= this.today &&
        this.today < this.competition.registrationEndDate
      ) {
        details.push('신청기간 중');
      } else if (this.today >= this.competition.registrationEndDate) {
        details.push('신청기간 후');
      }
    }

    if (this.competition.refundDeadlineDate !== null) {
      if (this.today < this.competition.refundDeadlineDate) {
        details.push('환불기간 중');
      } else {
        details.push('환불기간 후');
      }
    }

    if (
      this.competition.soloRegistrationAdjustmentStartDate !== null &&
      this.competition.soloRegistrationAdjustmentEndDate !== null
    ) {
      if (this.today < this.competition.soloRegistrationAdjustmentStartDate) {
        details.push('단독출전조정기간 전');
      } else if (
        this.today >= this.competition.soloRegistrationAdjustmentStartDate &&
        this.today < this.competition.soloRegistrationAdjustmentEndDate
      ) {
        details.push('단독출전조정기간 중 (단독출전 선수는 환불가능)');
      } else if (this.today >= this.competition.soloRegistrationAdjustmentEndDate) {
        details.push('단독출전조정기간 후');
      }
    }

    if (this.competition.registrationListOpenDate !== null) {
      if (this.today < this.competition.registrationListOpenDate) {
        details.push('출전명단공개 전');
      } else {
        details.push('출전명단공개 후');
      }
    }

    if (this.competition.bracketOpenDate !== null) {
      if (this.today < this.competition.bracketOpenDate) {
        details.push('대진표공개 전');
      } else {
        details.push('대진표공개 후');
      }
    }

    this.basicPeriodTitle = details.join(divider);
  }

  private setEarlybirdDiscountTitle(): void {
    if (!this.competition.earlybirdDiscountSnapshots || this.competition.earlybirdDiscountSnapshots.length === 0)
      return;
    const { earlybirdStartDate, earlybirdEndDate } =
      this.competition.earlybirdDiscountSnapshots[this.competition.earlybirdDiscountSnapshots.length - 1];
    if (this.today < earlybirdStartDate) {
      this.earlybirdDiscountTitle = '얼리버드할인기간 전';
    } else if (earlybirdStartDate <= this.today && this.today < earlybirdEndDate) {
      this.earlybirdDiscountTitle = '얼리버드할인기간 중';
    } else if (this.today >= earlybirdEndDate) {
      this.earlybirdDiscountTitle = '얼리버드할인기간 후';
    }
  }

  private setCombinationDiscountTitle(): void {
    if (!this.competition.combinationDiscountSnapshots || this.competition.combinationDiscountSnapshots.length === 0)
      return;
    this.combinationDiscountTitle = '조합할인적용';
  }

  private setAdditionalInfoTitle(): void {
    if (!this.competition.requiredAdditionalInfos || this.competition.requiredAdditionalInfos.length === 0) return;
    this.additionalInfoTitle = '추가정보요청';
  }

  private buildCompetitionTitle(): void {
    this.competition.title = `${this.competition.title}`;
    if (this.basicPeriodTitle !== '') this.competition.title += ` / ${this.basicPeriodTitle}`;
    if (this.earlybirdDiscountTitle !== '') this.competition.title += ` / ${this.earlybirdDiscountTitle}`;
    if (this.combinationDiscountTitle !== '') this.competition.title += ` / ${this.combinationDiscountTitle}`;
    if (this.additionalInfoTitle !== '') this.competition.title += ` / ${this.additionalInfoTitle}`;
  }

  public build(): ICompetition {
    this.buildCompetitionTitle();
    return this.competition as ICompetition;
  }
}

export const generateDummyCompetitions = (): ICompetition[] => {
  const competitions: ICompetition[] = [];
  const today = new Date();
  const start = DateTime.fromJSDate(today).minus({ days: 49 }).toJSDate();
  const end = DateTime.fromJSDate(today).plus({ days: 50 }).toJSDate();
  const divisionFactory = new DivisionFactory();
  const dummyDivisons = divisionFactory.createDivisions('tmp-competition-id', generateDummyDivisionPacks());
  let count = 0;
  for (
    let competitionDate = new Date(start);
    competitionDate <= end;
    competitionDate = DateTime.fromJSDate(competitionDate).plus({ days: 1 }).toJSDate()
  ) {
    competitions.push(
      // 1. 비협약
      new CompetitionDummyBuilder()
        .setTitle(`${count++}`)
        .setIsPartnership(false)
        .setCompetitionDates(competitionDate)
        .build(),
      // 2. 협약, divisions
      new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle(`${count++}`)
        .setCompetitionDates(competitionDate)
        // .setDivisions(dummyDivisons)
        .build(),
      // 3. 2 + 얼리버드 할인
      new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle(`${count++}`)
        .setCompetitionDates(competitionDate)
        // .setDivisions(dummyDivisons)
        .setEarlybirdDiscountSnapshots(10000)
        .build(),
      // 4. 3 + 조합 할인
      new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle(`${count++}`)
        .setCompetitionDates(competitionDate)
        // .setDivisions(dummyDivisons)
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .build(),
      // 5. 4 + 추가정보
      new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle(`${count++}`)
        .setCompetitionDates(competitionDate)
        // .setDivisions(dummyDivisons)
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .build(),
    );
  }
  return competitions;
};

// const competitions = generateDummyCompetitions();
// console.log('competitions.length:', competitions.length);
// console.log(JSON.stringify(competitions, null, 2));
