import { DateTime } from '../common/utils/date-time';
import { DivisionFactory } from '../modules/competitions/domain/division.factory';
import { ICombinationDiscountSnapshot } from '../modules/competitions/domain/interface/combination-discount-snapshot.interface';
import {
  TCompetitionLocationFilter,
  TCompetitionStatus,
  ICompetition,
} from '../modules/competitions/domain/interface/competition.interface';
import { IEarlybirdDiscountSnapshot } from '../modules/competitions/domain/interface/earlybird-discount-snapshot.interface';
import { IRequiredAdditionalInfo } from '../modules/competitions/domain/interface/required-addtional-info.interface';
import typia, { tags } from 'typia';
import { uuidv7 } from 'uuidv7';
import { generateDummyDivisionPacks } from './division.dummy';
import { dummyCombinationDiscountRules } from './combination-discount-snapshot.dummy';
import { ICombinationDiscountRule } from '../modules/competitions/domain/interface/combination-discount-rule.interface';
import { IDivisionPack } from '../modules/competitions/domain/interface/division-pack.interface';
import appEnv from '../common/app-env';

export class CompetitionDummyBuilder {
  private competition: ICompetition = {
    id: uuidv7(),
    title: 'Dummy Competition',
    address: typia.random<TCompetitionLocationFilter>(),
    description: 'Dummy Competition Description',
    isPartnership: true,
    viewCount: typia.random<number & tags.Type<'uint32'> & tags.Minimum<0> & tags.Maximum<1000>>(),
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
    competitionHostMaps: [], // todo!!!: competitionHostMaps에 데이터 추가하기
    competitionPosterImages: [],
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

  public setAddress(address: TCompetitionLocationFilter): this {
    this.competition.address = address;
    return this;
  }

  public setCompetitionBasicDates(date: Date): this {
    this.generateCompetitionDates(date);
    this.setBasicPeriodTitle();
    return this;
  }

  public setCompetitionDate(date: Date | null): this {
    this.competition.competitionDate = date;
    return this;
  }

  public setRegistrationStartDate(date: Date | null): this {
    this.competition.registrationStartDate = date;
    return this;
  }

  public setRegistrationEndDate(date: Date | null): this {
    this.competition.registrationEndDate = date;
    return this;
  }

  public setRefundDeadlineDate(date: Date | null): this {
    this.competition.refundDeadlineDate = date;
    return this;
  }

  public setSoloRegistrationAdjustmentStartDate(date: Date | null): this {
    this.competition.soloRegistrationAdjustmentStartDate = date;
    return this;
  }

  public setSoloRegistrationAdjustmentEndDate(date: Date | null): this {
    this.competition.soloRegistrationAdjustmentEndDate = date;
    return this;
  }

  public setRegistrationListOpenDate(date: Date | null): this {
    this.competition.registrationListOpenDate = date;
    return this;
  }

  public setBracketOpenDate(date: Date | null): this {
    this.competition.bracketOpenDate = date;
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

  public setStatus(status: TCompetitionStatus): this {
    this.competition.status = status;
    return this;
  }

  public setDivisions(divisionPacks: IDivisionPack[]): this {
    const divisionFactory = new DivisionFactory();
    this.competition.divisions = divisionFactory.createDivisions(this.competition.id, divisionPacks);
    return this;
  }

  public setCompetitionHostMaps(hostIds: string[]): this {
    this.competition.competitionHostMaps = hostIds.map((hostId) => ({
      id: uuidv7(),
      hostId,
      competitionId: this.competition.id,
    }));
    return this;
  }

  public setEarlybirdDiscountSnapshots(discountAmount: number): this {
    if (!this.competition.registrationStartDate || !this.competition.registrationEndDate)
      throw new Error('setEarlybirdDiscountSnapshots: registrationStartDate or registrationEndDate is null');
    const snapshot: IEarlybirdDiscountSnapshot = {
      id: uuidv7(),
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
      id: uuidv7(),
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
        id: uuidv7(),
        type: 'ADDRESS',
        description: '지역구 주짓수대회 인구조사를 위한 주소 요청',
        createdAt: this.competition.createdAt,
        deletedAt: null,
        competitionId: this.competition.id,
      },
      {
        id: uuidv7(),
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
    this.competition.title += this.competition.isPartnership ? ' / 협약' : ' / 비협약';
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
        .setCompetitionBasicDates(competitionDate)
        .build(),
      // 2. 협약, divisions
      new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle(`${count++}`)
        .setCompetitionBasicDates(competitionDate)
        .setDivisions(generateDummyDivisionPacks())
        .setCompetitionHostMaps(appEnv.adminCredentials.map((admin) => admin.id))
        .build(),
      // 3. 2 + 얼리버드 할인
      new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle(`${count++}`)
        .setCompetitionBasicDates(competitionDate)
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCompetitionHostMaps(appEnv.adminCredentials.map((admin) => admin.id))
        .build(),
      // 4. 3 + 조합 할인
      new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle(`${count++}`)
        .setCompetitionBasicDates(competitionDate)
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setCompetitionHostMaps(appEnv.adminCredentials.map((admin) => admin.id))
        .build(),
      // 5. 4 + 추가정보
      new CompetitionDummyBuilder()
        .setIsPartnership(true)
        .setTitle(`${count++}`)
        .setCompetitionBasicDates(competitionDate)
        .setDivisions(generateDummyDivisionPacks())
        .setEarlybirdDiscountSnapshots(10000)
        .setCombinationDiscountSnapshots(dummyCombinationDiscountRules)
        .setRequiredAdditionalInfos()
        .setCompetitionHostMaps(appEnv.adminCredentials.map((admin) => admin.id))
        .build(),
    );
  }
  return competitions;
};

// const competitions = generateDummyCompetitions();
// console.log('competitions.length:', competitions.length);
// console.log(JSON.stringify(competitions, null, 2));
