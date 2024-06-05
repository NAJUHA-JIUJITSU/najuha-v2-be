import { tags } from 'typia';

export type TDateOrStringDate = Date | (string & tags.Format<'date-time'>);

/** UUID v7. */
export type TId = string & tags.Format<'uuid'>;

export interface IPaginationParam {
  /**
   * Page number.
   * @minimum 0
   * @default 0
   */
  page: number & tags.Type<'uint32'> & tags.Minimum<0>;

  /**
   * Number of items per page.
   * @minimum 1
   * @maximum 30
   * @default 10
   */
  limit: number & tags.Type<'uint32'> & tags.Minimum<1> & tags.Maximum<30>;
}

export interface IPaginationRet {
  /**
   * Next page number.
   * 다음 페이지가 존재하지 않으면 undefined.
   */
  nextPage?: number;
}
