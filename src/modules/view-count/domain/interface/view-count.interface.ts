import { TId } from '../../../../common/common-types';
import { tags } from 'typia';

export type TEntitytype = 'POST' | 'COMPETITION';

export type TUserCredential = TId | TIp;

type TIp = (string & tags.Format<'ipv4'>) | (string & tags.Format<'ipv6'>);
