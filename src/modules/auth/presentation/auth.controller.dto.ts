import { AcquireAdminRoleRet, RefreshTokenRet, SnsLoginRet } from '../application/auth.app.dto';
import { IUser } from 'src/modules/users/domain/interface/user.interface';

// Presentation Layer Request DTOs --------------------------------------------
export interface SnsLoginReqBody {
  /** - snsProvider. */
  snsAuthProvider: IUser['snsAuthProvider'];

  /** - authCode. */
  snsAuthCode: string;
}

export interface RefreshTokenReqBody {
  /** - refreshToken. */
  refreshToken: string;
}

// Presentation Layer Response DTOs -------------------------------------------
export interface SnsLoginRes extends SnsLoginRet {}

export interface RefreshTokenRes extends RefreshTokenRet {}

export interface AcquireAdminRoleRes extends AcquireAdminRoleRet {}
