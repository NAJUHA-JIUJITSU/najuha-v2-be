import { tags } from 'typia';

export type DateOrStringDate = Date | (string & tags.Format<'date-time'>);
