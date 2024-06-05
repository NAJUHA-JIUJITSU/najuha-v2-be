import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { IAuthTokens } from '../domain/interface/auth-tokens.interface';

// Application Layer Param DTOs ----------------------------------------------
export interface SnsLoginParam {
  /** - snsProvider. */
  snsAuthProvider: IUser['snsAuthProvider'];

  /** - authCode. */
  snsAuthCode: string;
}

export interface RefreshTokenParam {
  /** - refreshToken. */
  refreshToken: string;
}

export interface AcquireAdminRoleParam {
  /** - userId. */
  userId: IUser['id'];
}

// Application Layer Result DTOs ----------------------------------------------
export interface SnsLoginRet {
  /** - authTokens. */
  authTokens: IAuthTokens;
}

export interface RefreshTokenRet {
  /** - authTokens. */
  authTokens: IAuthTokens;
}

export interface AcquireAdminRoleRet {
  /** - authTokens. */
  authTokens: IAuthTokens;
}
