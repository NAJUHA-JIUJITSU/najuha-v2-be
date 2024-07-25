import { IUser } from '../../../users/domain/interface/user.interface';

/**
 * AuthTokenPayload.
 *
 * AuthToken 에 담기는 payload.
 */
export interface IAuthTokenPayload {
  /** userId. */
  userId: IUser['id'];

  /** userRole. */
  userRole: IUser['role'];
}
