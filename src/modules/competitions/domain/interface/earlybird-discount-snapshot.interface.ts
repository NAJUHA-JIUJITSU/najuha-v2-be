import { tags } from 'typia';
import { ICompetition } from './competition.interface';
import { TId, TDateOrStringDate } from 'src/common/common-types';

export interface IEarlybirdDiscountSnapshot {
  /**  UUID v7. */
  id: TId;

  /** 얼리버드 할인 시작일. */
  earlybirdStartDate: TDateOrStringDate;

  /** 얼리버드 할인 마감일. */
  earlybirdEndDate: TDateOrStringDate;

  /**
   * 얼리버드 할인 가격.
   * - ex) 10000.
   * - 단위 : 원.
   * - 음수 값은 허용하지 않습니다.
   */
  discountAmount: number & tags.Type<'uint32'> & tags.Minimum<0>;

  /** CreatedAt. */
  createdAt: TDateOrStringDate;

  /** Competition id. */
  competitionId: ICompetition['id'];
}

export interface IEarlybirdDiscountSnapshotCreateDto
  extends Pick<
    IEarlybirdDiscountSnapshot,
    'earlybirdStartDate' | 'earlybirdEndDate' | 'discountAmount' | 'competitionId'
  > {}
