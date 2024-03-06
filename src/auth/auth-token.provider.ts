import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { AuthTokensDto } from 'src/auth/dto/auth-tokens.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthErrorMap, BusinessException } from 'src/common/response/errorResponse';
import appConfig from 'src/common/appConfig';

@Injectable()
export class AuthTokenProvider {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly jwtService: JwtService,
  ) {}

  async createAuthTokens(userId: UserEntity['id'], userRole: UserEntity['role']): Promise<AuthTokensDto> {
    const accessToken = this.createAccessToken(userId, userRole);
    const refreshToken = this.createRefreshToken(userId, userRole);

    await this.redisClient.set(`userId:${userId}:refreshToken`, refreshToken);

    // this.testPrintAllRedisData('createAuthTokens');

    return {
      accessToken,
      refreshToken,
    };
  }

  private createAccessToken(userId: UserEntity['id'], userRole: UserEntity['role']): string {
    const payload = { userId, userRole };
    return this.jwtService.sign(payload, {
      secret: appConfig.jwtAccessTokenSecret,
      expiresIn: appConfig.jwtAccessTokenExpirationTime,
    });
  }

  private createRefreshToken(userId: UserEntity['id'], userRole: UserEntity['role']): string {
    const payload = { userId, userRole };
    return this.jwtService.sign(payload, {
      secret: appConfig.jwtRefreshTokenSecret,
      expiresIn: appConfig.jwtRefreshTokenExpirationTime,
    });
  }

  /**
   * refreshToken의 유효성 검사
   * 1. refreshToken의 유효성 검사
   * 2. redis에 저장된 refreshToken과 비교
   *
   * 오류 발생시 redis에 저장된 refreshToken 삭제(로그아웃 처리)
   */
  async verifyRefreshToken(refreshToken: string): Promise<any> {
    let payload;

    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: appConfig.jwtRefreshTokenSecret,
      });
    } catch (e) {
      if (payload?.userId) await this.redisClient.del(`userId:${payload.userId}:refreshToken`);
      throw new BusinessException(AuthErrorMap.AUTH_REFRESH_TOKEN_UNAUTHORIZED, e.message);
    }

    const storedRefreshToken = await this.redisClient.get(`userId:${payload.userId}:refreshToken`);

    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      await this.redisClient.del(`userId:${payload.userId}:refreshToken`);
      throw new BusinessException(AuthErrorMap.AUTH_REFRESH_TOKEN_UNAUTHORIZED);
    }

    return payload;
  }

  // TODO: 지워야함
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
