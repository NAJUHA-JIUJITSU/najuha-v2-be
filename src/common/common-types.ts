import { tags } from 'typia';

export type TDateOrStringDate = Date | (string & tags.Format<'date-time'>);

export type TId = string & tags.MinLength<36> & tags.MaxLength<36>;
