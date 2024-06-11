import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { AuthErrors, BusinessException } from '../../../common/response/errorResponse';
import appEnv from '../../../common/app-env';
import { IAuthTokens } from './interface/auth-tokens.interface';
import { IAuthTokenPayload } from './interface/auth-token-payload.interface';

@Injectable()
export class AuthTokenDomainService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly jwtService: JwtService,
  ) {}

  async createAuthTokens({ userId, userRole }: IAuthTokenPayload): Promise<IAuthTokens> {
    const accessToken = this.createAccessToken({ userId, userRole });
    const refreshToken = this.createRefreshToken({ userId, userRole });
    await this.redisClient.set(
      `userId:${userId}:refreshToken`,
      refreshToken,
      'EX',
      appEnv.redisRefreshTokenExpirationTime,
    );
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
      if (decoded?.userId) this.redisClient.del(`userId:${decoded.userId}:refreshToken`);
      throw new BusinessException(AuthErrors.AUTH_REFRESH_TOKEN_UNAUTHORIZED, e.message);
    }

    const storedRefreshToken = await this.redisClient.get(`userId:${payload.userId}:refreshToken`);
    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      await this.redisClient.del(`userId:${payload.userId}:refreshToken`);
      throw new BusinessException(AuthErrors.AUTH_REFRESH_TOKEN_UNAUTHORIZED);
    }
    return payload;
  }

  // todo!: 지워야함
  private async testPrintAllRedisData(message: string) {
    console.log(`[TEST REDIS] ${message}--------------------------------`);

    const keys = await this.redisClient.keys('*');

    const keyValuePairs = await Promise.all(
      keys.map(async (key) => {
        const value = await this.redisClient.get(key);
        return { key, value };
      }),
    );

    keyValuePairs.forEach((pair) => {
      console.log(`${pair.key}: ${pair.value}`);
    });
  }
}
