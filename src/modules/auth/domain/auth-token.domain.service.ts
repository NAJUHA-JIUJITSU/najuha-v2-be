import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthErrors, BusinessException } from '../../../common/response/errorResponse';
import appEnv from '../../../common/app-env';
import { IAuthTokens } from './interface/auth-tokens.interface';
import { IAuthTokenPayload } from './interface/auth-token-payload.interface';
import { RefreshTokenProvider } from '../../../infrastructure/redis/provider/refresh-token.provider';

@Injectable()
export class AuthTokenDomainService {
  constructor(
    private readonly refreshTokenProvider: RefreshTokenProvider,
    private readonly jwtService: JwtService,
  ) {}

  async createAuthTokens({ userId, userRole }: IAuthTokenPayload): Promise<IAuthTokens> {
    const accessToken = this.createAccessToken({ userId, userRole });
    const refreshToken = this.createRefreshToken({ userId, userRole });
    await this.refreshTokenProvider.set(userId, refreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  private createAccessToken(payload: IAuthTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: appEnv.jwtAccessTokenSecret,
      expiresIn: appEnv.jwtAccessTokenExpirationTime,
    });
  }

  private createRefreshToken(payload: IAuthTokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: appEnv.jwtRefreshTokenSecret,
      expiresIn: appEnv.jwtRefreshTokenExpirationTime,
    });
  }

  /**
   * refreshToken의 유효성 검사
   * 1. refreshToken의 유효성 검사
   * 2. redis에 저장된 refreshToken과 비교
   *
   * 오류 발생시 redis에 저장된 refreshToken 삭제(로그아웃 처리)
   */
  async verifyRefreshToken(refreshToken: string): Promise<IAuthTokenPayload> {
    let payload: IAuthTokenPayload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: appEnv.jwtRefreshTokenSecret,
      });
    } catch (e: any) {
      const decoded = this.jwtService.decode(refreshToken);
      if (decoded?.userId) this.refreshTokenProvider.del(decoded.userId);
      throw new BusinessException(AuthErrors.AUTH_REFRESH_TOKEN_UNAUTHORIZED, e.message);
    }

    const storedRefreshToken = await this.refreshTokenProvider.get(payload.userId);
    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      await this.refreshTokenProvider.del(payload.userId);
      throw new BusinessException(AuthErrors.AUTH_REFRESH_TOKEN_UNAUTHORIZED);
    }
    return payload;
  }
}
