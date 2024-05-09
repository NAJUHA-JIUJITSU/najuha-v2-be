//   /** - 대회 날짜. */
//   competitionDate: null | DateOrStringDate;
//   /** - 참가 신청 시작일 */
//   registrationStartDate: null | DateOrStringDate;
//   /** - 참가 신청 마감일. */
//   registrationEndDate: null | DateOrStringDate;
//   /** - 환불 가능 기간 마감일. */
//   refundDeadlineDate: null | DateOrStringDate;
//   /**
//    * 단독 참가자의 부문 조정 시작일.
//    * - 부문에 참가자가 한 명만 있는 경우, 해당 참가자를 다른 체급이나 부문으로 조정할 수 있는 기간의 시작을 나타냅니다.
//    */
//   soloRegistrationAdjustmentStartDate: null | DateOrStringDate;
//   /** - 단독 참가자의 부문 조정 마감일. */
//   soloRegistrationAdjustmentEndDate: null | DateOrStringDate;
//   /** - 참가자 명단 공개일. */
//   registrationListOpenDate: null | DateOrStringDate;
//   /** - 대진표 공개일. */
//   bracketOpenDate: null | DateOrStringDate;

import {
  ICompetition,
  ICompetitionQueryOptions,
} from 'src/modules/competitions/domain/interface/competition.interface';
import typia, { tags } from 'typia';
import { ulid } from 'ulid';
import { IDivisionPack } from './modules/competitions/domain/interface/division-pack.interface';
import { DateTime } from './common/date-time';

export interface ICompetitionDates {
  competitionDate: Date;
  registrationStartDate: Date;
  registrationEndDate: Date;
  refundDeadlineDate: Date;
  soloRegistrationAdjustmentStartDate: Date;
  soloRegistrationAdjustmentEndDate: Date;
  registrationListOpenDate: Date;
  bracketOpenDate: Date;
}

const adjustDateWithLuxon = (
  baseDate: Date,
  months: number,
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
): Date => {
  const dt = DateTime.fromJSDate(baseDate).plus({ months, days }).set({ hours, minutes, seconds });
  return dt.toJSDate();
};

const generateCompetitionDates = (baseDate: Date): ICompetitionDates => {
  const competitionDate = adjustDateWithLuxon(baseDate, 0, 0, 23, 59, 59);
  const registrationStartDate = adjustDateWithLuxon(competitionDate, -3, 0, 0, 0, 0);
  const registrationEndDate = adjustDateWithLuxon(competitionDate, 0, -14, 23, 59, 59);
  const refundDeadlineDate = adjustDateWithLuxon(competitionDate, 0, -14, 23, 59, 59);
  const soloRegistrationAdjustmentStartDate = adjustDateWithLuxon(registrationEndDate, 0, +1, 0, 0, 0);
  const soloRegistrationAdjustmentEndDate = adjustDateWithLuxon(soloRegistrationAdjustmentStartDate, 0, +2, 23, 59, 59);
  const registrationListOpenDate = adjustDateWithLuxon(registrationEndDate, 0, -7, 0, 0, 0);
  const bracketOpenDate = adjustDateWithLuxon(registrationEndDate, 0, +3, 0, 0, 0);
  const ret = {
    competitionDate,
    registrationStartDate,
    registrationEndDate,
    refundDeadlineDate,
    soloRegistrationAdjustmentStartDate,
    soloRegistrationAdjustmentEndDate,
    registrationListOpenDate,
    bracketOpenDate,
  };
  return ret;
};

const generateCompetitionTitle = (
  {
    registrationStartDate,
    registrationEndDate,
    refundDeadlineDate,
    soloRegistrationAdjustmentStartDate,
    soloRegistrationAdjustmentEndDate,
  }: ICompetitionDates,
  now: Date,
): string => {
  const searchKeywords: string[] = [];
  const details: string[] = [];
  const divider = ' | ';

  if (now < registrationStartDate) {
    searchKeywords.push('신청X');
    details.push('신청 기간 전');
  } else if (registrationStartDate <= now && now < registrationEndDate) {
    searchKeywords.push('신청O');
    details.push('신청 기간 중');
  } else if (now >= registrationEndDate) {
    searchKeywords.push('신청X');
    details.push('신청 기간 후');
  }

  if (now < refundDeadlineDate) {
    searchKeywords.push('환불O');
    details.push('환불 기간 중');
  } else {
    searchKeywords.push('환불X');
    details.push('환불 기간 후');
  }

  if (now < soloRegistrationAdjustmentStartDate) {
    searchKeywords.push('단독출전조정X');
    details.push('단독출전조정 기간 전');
  } else if (now >= soloRegistrationAdjustmentStartDate && now < soloRegistrationAdjustmentEndDate) {
    searchKeywords.push('단독출전조정O');
    details.push('단독출전조정 기간 중 (단독출전 선수는 환불가능)');
  } else if (now >= soloRegistrationAdjustmentEndDate) {
    searchKeywords.push('단독출전조정X');
    details.push('단독출전조정 기간 후');
  }
  return searchKeywords.join(divider) + ' (' + details.join(divider) + ')';
};

export const generateDummyCompetition = (now: Date = new Date(), count: number = 0): ICompetition => {
  const competitionDates = generateCompetitionDates(now);
  const title = generateCompetitionTitle(competitionDates, now);
  return {
    ...competitionDates,
    id: ulid(),
    title: `${count}. ${title}`,
    address: `${typia.random<ICompetitionQueryOptions['locationFilter']>()}`,
    isPartnership: typia.random<ICompetition['isPartnership']>(),
    description: `대회 설명 ${title}`,
    viewCount: typia.random<number & tags.Type<'uint32'> & tags.Minimum<0> & tags.Maximum<1000>>(),
    posterImgUrlKey: null,
    status: typia.random<ICompetition['status']>(),
    createdAt: competitionDates.registrationStartDate,
    updatedAt: competitionDates.registrationStartDate,
  };
};

// export const generateDummyCompetitions = (): ICompetition[] => {
//   const competitions: ICompetition[] = [];
//   const now = new Date();
//   const start = DateTime.fromJSDate(now).minus({ months: 1 }).toJSDate();
//   const end = DateTime.fromJSDate(now).plus({ months: 4 }).toJSDate();
//   let count = 0;
//   let competitionDate = new Date(start);
//   while (competitionDate <= end) {
//     competitions.push(generateDummyCompetition(competitionDate, count));
//     competitionDate.setDate(competitionDate.getDate() + 1);
//     count++;
//   }
//   return competitions;
// };

// {
//   "divisionPacks": [
//     {
//       "categories": [
//         "초등부"
//       ],
//       "uniforms": [
//         "GI",
//         "NOGI"
//       ],
//       "genders": [
//         "MALE",
//         "FEMALE"
//       ],
//       "belts": [
//         "화이트",
//         "유색"
//       ],
//       "weights": [
//         "-30",
//         "-40.4",
//         "ABSOLUTE"
//       ],
//       "birthYearRangeStart": "2007",
//       "birthYearRangeEnd": "2008",
//       "price": 40000
//     }
//   ]
// }

// 초등부12 : 8 ~ 9
// 초등부34 : 10 ~ 11
// 초등부56 : 12 ~ 13
// 초등부123 : 8 ~ 13
// 초등부456 : 10 ~ 13
// 중등부 : 14 ~ 16
// 고등부 : 17 ~ 19
// 어덜트 : 20 ~ open
// 마스터1 : 30 ~ open

const generateBirthYearRange = (categorie) => {
  const currentYear = new Date().getFullYear();
  let birthYearRangeStart, birthYearRangeEnd;

  switch (categorie) {
    case '초등부12':
      birthYearRangeStart = currentYear - 9;
      birthYearRangeEnd = currentYear - 8;
      break;
    case '초등부34':
      birthYearRangeStart = currentYear - 11;
      birthYearRangeEnd = currentYear - 10;
      break;
    case '초등부56':
      birthYearRangeStart = currentYear - 13;
      birthYearRangeEnd = currentYear - 12;
      break;
    case '초등부123':
      birthYearRangeStart = currentYear - 13;
      birthYearRangeEnd = currentYear - 8;
      break;
    case '초등부456':
      birthYearRangeStart = currentYear - 13;
      birthYearRangeEnd = currentYear - 10;
      break;
    case '중등부':
      birthYearRangeStart = currentYear - 16;
      birthYearRangeEnd = currentYear - 14;
      break;
    case '고등부':
      birthYearRangeStart = currentYear - 19;
      birthYearRangeEnd = currentYear - 17;
      break;
    case '어덜트':
      birthYearRangeStart = currentYear - 20;
      birthYearRangeEnd = 1900;
      break;
    case '마스터':
      birthYearRangeStart = currentYear - 30;
      birthYearRangeEnd = 1900;
      break;
    default:
      birthYearRangeStart = 9999;
      birthYearRangeEnd = 1900;
  }

  return {
    birthYearRangeStart: birthYearRangeStart.toString(),
    birthYearRangeEnd: birthYearRangeEnd.toString(),
  };
};

export const divisionPacks: IDivisionPack[] = [
  {
    categories: ['초등부123'],
    uniforms: ['GI', 'NOGI'],
    genders: ['MIXED'],
    belts: ['화이트', '유색'],
    weights: ['-20', '-25', '-30', '-35', '-40', '-45', '-50', '-55', '+55'],
    price: 40000,
    ...generateBirthYearRange('초등부123'),
  },
];
