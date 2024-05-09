import { tags } from 'typia';
import { ICompetition } from './competition.interface';
import { DateOrStringDate } from 'src/common/common-types';

export interface IEarlybirdDiscountSnapshot {
  /**  ULID. */
  id: string & tags.MinLength<26> & tags.MaxLength<26>;

  /** 얼리버드 할인 시작일. */
  earlybirdStartDate: DateOrStringDate;

  /** 얼리버드 할인 마감일. */
  earlybirdEndDate: DateOrStringDate;

  /**
   * 얼리버드 할인 가격.
   * - ex) 10000.
   * - 단위 : 원.
   * - 음수 값은 허용하지 않습니다.
   */
  discountAmount: number & tags.Type<'uint32'> & tags.Minimum<0>;

  /** CreatedAt. */
  createdAt: DateOrStringDate;

  /** Competition id. */
  competitionId: ICompetition['id'];
}

export interface IEarlybirdDiscountSnapshotCreateDto
  extends Pick<
    IEarlybirdDiscountSnapshot,
    'earlybirdStartDate' | 'earlybirdEndDate' | 'discountAmount' | 'competitionId'
  > {}
