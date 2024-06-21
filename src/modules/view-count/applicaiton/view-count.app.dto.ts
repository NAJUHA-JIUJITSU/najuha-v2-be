import { TId } from '../../../common/common-types';
import { TEntitytype, TUserCredential } from '../domain/view-count.interface';

// ---------------------------------------------------------------------------
// viewCountAppService Param
// ---------------------------------------------------------------------------
export interface IncrementEntityViewCountParam {
  userCredential: TUserCredential;
  entityType: TEntitytype;
  entityId: TId;
}

// ---------------------------------------------------------------------------
// viewCountAppService Result
// ---------------------------------------------------------------------------
export interface IncrementEntityViewCountRet {
  isIncremented: boolean;
  message: string;
}
