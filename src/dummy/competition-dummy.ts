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
import { generateDivisionPacks } from './division-dummy';
import { dummyCombinationDiscountRules } from './combination-discount-snapshot-dummy';
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
  private preiodTitle = '';
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
    this.generateCompetitionTitleRelatideToPreiod();
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
      earlybirdStartDate: this.adjustDate(new Date(this.competition.registrationStartDate), 0, 0, 0, 0),
      earlybirdEndDate: this.adjustDate(new Date(this.competition.registrationEndDate), -7, 23, 59, 59),
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
    return this;
  }

  public setRequiredAdditionalInfos(infos: IRequiredAdditionalInfo[]): this {
    const dummyRequiredAdditionalInfos: IRequiredAdditionalInfo[] = [
      {
        id: ulid(),
        type: 'ADDRESS',
        description: '지역구 주짓수대회 인구조사를 위한 주소 요청',
        createdAt: this.competition.createdAt,
        competitionId: this.competition.id,
      },
      {
        id: ulid(),
        type: 'SOCIAL_SECURITY_NUMBER',
        description: '지역구 주짓수대회 인구조사를 위한 주민번호 요청',
        createdAt: this.competition.createdAt,
        competitionId: this.competition.id,
      },
    ];
    this.competition.requiredAdditionalInfos = dummyRequiredAdditionalInfos;
    return this;
  }

  private adjustDate(baseDate: Date, days: number, hours: number, minutes: number, seconds: number): Date {
    const dt = DateTime.fromJSDate(baseDate).plus({ days }).set({ hours, minutes, seconds });
    return dt.toJSDate();
  }

  private generateCompetitionDates(baseDate: Date): void {
    let competitionDate: Date;
    let registrationStartDate: Date;
    let registrationEndDate: Date;
    let refundDeadlineDate: Date;
    let soloRegistrationAdjustmentStartDate: Date;
    let soloRegistrationAdjustmentEndDate: Date;
    let registrationListOpenDate: Date;
    let bracketOpenDate: Date;
    competitionDate = this.adjustDate(baseDate, 0, 23, 59, 59);
    registrationStartDate = this.adjustDate(baseDate, -50, 0, 0, 0);
    registrationEndDate = this.adjustDate(baseDate, -14, 23, 59, 59);
    refundDeadlineDate = this.adjustDate(baseDate, -14, 23, 59, 59);
    soloRegistrationAdjustmentStartDate = this.adjustDate(registrationEndDate, +1, 0, 0, 0);
    soloRegistrationAdjustmentEndDate = this.adjustDate(soloRegistrationAdjustmentStartDate, +2, 23, 59, 59);
    registrationListOpenDate = this.adjustDate(registrationEndDate, -7, 0, 0, 0);
    bracketOpenDate = this.adjustDate(registrationEndDate, +3, 0, 0, 0);
    this.competition.competitionDate = competitionDate;
    this.competition.registrationStartDate = registrationStartDate;
    this.competition.registrationEndDate = registrationEndDate;
    this.competition.refundDeadlineDate = refundDeadlineDate;
    this.competition.soloRegistrationAdjustmentStartDate = soloRegistrationAdjustmentStartDate;
    this.competition.soloRegistrationAdjustmentEndDate = soloRegistrationAdjustmentEndDate;
    this.competition.registrationListOpenDate = registrationListOpenDate;
    this.competition.bracketOpenDate = bracketOpenDate;
  }

  private generateCompetitionTitleRelatideToPreiod(): void {
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
    this.preiodTitle = details.join(divider);
  }

  private setRegistrationPeriodTitle(): void {
    if (!this.competition.registrationStartDate || !this.competition.registrationEndDate) return;
    if (this.today < this.competition.registrationStartDate) {
      this.preiodTitle = '신청기간 전';
    } else if (
      this.competition.registrationStartDate <= this.today &&
      this.today < this.competition.registrationEndDate
    ) {
      this.preiodTitle = '신청기간 중';
    } else if (this.today >= this.competition.registrationEndDate) {
      this.preiodTitle = '신청기간 후';
    }
  }

  private setRefundPeriodTitle(): void {
    if (!this.competition.refundDeadlineDate) return;
    if (this.today < this.competition.refundDeadlineDate) {
      this.preiodTitle = '환불기간 중';
    } else {
      this.preiodTitle = '환불기간 후';
    }
  }

  private setSoloRegistrationAdjustmentPeriodTitle(): void {
    if (!this.competition.soloRegistrationAdjustmentStartDate || !this.competition.soloRegistrationAdjustmentEndDate)
      return;
    if (this.today < this.competition.soloRegistrationAdjustmentStartDate) {
      this.preiodTitle = '단독출전조정기간 전';
    } else if (
      this.competition.soloRegistrationAdjustmentStartDate <= this.today &&
      this.today < this.competition.soloRegistrationAdjustmentEndDate
    ) {
      this.preiodTitle = '단독출전조정기간 중 (단독출전 선수는 환불가능)';
    } else if (this.today >= this.competition.soloRegistrationAdjustmentEndDate) {
      this.preiodTitle = '단독출전조정기간 후';
    }
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

  public build(): ICompetition {
    this.competition.title = `${this.competition.title}`;
    if (this.preiodTitle !== '') this.competition.title += ` / ${this.preiodTitle}`;
    if (this.earlybirdDiscountTitle !== '') this.competition.title += ` / ${this.earlybirdDiscountTitle}`;
    if (this.combinationDiscountTitle !== '') this.competition.title += ` / ${this.combinationDiscountTitle}`;
    if (this.additionalInfoTitle !== '') this.competition.title += ` / ${this.additionalInfoTitle}`;
    return this.competition as ICompetition;
  }
}

export const generateDummyCompetitions = (): ICompetition[] => {
  const competitions: ICompetition[] = [];
  const today = new Date();
  const start = DateTime.fromJSDate(today).minus({ days: 50 }).toJSDate();
  const end = DateTime.fromJSDate(today).plus({ days: 50 }).toJSDate();
  const divisionFactory = new DivisionFactory();
  const dummyDivisons = divisionFactory.createDivisions('tmp-competition-id', generateDivisionPacks());
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
      // 2. 협약
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
        // .setRequiredAdditionalInfos()
        .build(),
    );
  }
  return competitions;
};

const competitions = generateDummyCompetitions();
console.log(JSON.stringify(competitions, null, 2));
