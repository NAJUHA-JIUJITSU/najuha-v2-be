import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { AuthTokensDto } from 'src/auth/dto/auth-tokens.dto';
import { RefreshTokenDto } from 'src/auth/dto/refresh-token.dto';
import { SnsAuthDto } from 'src/sns-auth/dto/sns-auth.dto';
import { SnsAuthService } from 'src/sns-auth/sns-auth.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthErrorMap, BusinessException } from 'src/common/response/errorResponse';
import appConfig from 'src/common/appConfig';

@Injectable()
export class AuthService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly snsAuthService: SnsAuthService,
  ) {}

  async snsLogin(snsAuthDto: SnsAuthDto): Promise<AuthTokensDto> {
    const userData = await this.snsAuthService.validate(snsAuthDto);
    let user = await this.usersService.findUserBySnsIdAndProvider(userData.snsAuthProvider, userData.snsId);

    if (!user) user = await this.usersService.createUser(userData);
    const authTokens = await this.createAuthTokens(user.id, user.role);
    return authTokens;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthTokensDto> {
    const { refreshToken } = refreshTokenDto;
    const payload = await this.verifyRefreshToken(refreshToken);
    const authTokens = await this.createAuthTokens(payload.userId, payload.userRole);

    return authTokens;
  }

  async createAuthTokens(userId: UserEntity['id'], userRole: UserEntity['role']): Promise<AuthTokensDto> {
    const accessToken = this.createAccessToken(userId, userRole);
    const refreshToken = this.createRefreshToken(userId, userRole);

    await this.redisClient.set(`userId:${userId}:refreshToken`, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  // async aquireAdminRole(userId: UserEntity['id']): Promise<AuthTokensDto> {
  //   const user = await this.usersService.getUserById(userId);
  //   if (!user) throw new BusinessException(AuthErrorMap.USER_NOT_FOUND);

  //   const authTokens = await this.createAuthTokens(user.id, user.role);
  //   return authTokens;
  // }

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
   * 1. refreshToken이 redis에 저장된 값과 일치하는지 확인
   * 2. refreshToken이 만료되지 않았는지 확인
   * 3. refreshToken의 payload 반환
   *
   * 오류 발생시 redis에 저장된 refreshToken 삭제(로그아웃 처리)
   */
  private async verifyRefreshToken(refreshToken: string): Promise<any> {
    const payload = this.jwtService.decode(refreshToken);

    const storedRefreshToken = await this.redisClient.get(`userId:${payload.userId}:refreshToken`);

    if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
      await this.redisClient.del(`userId:${payload.userId}:refreshToken`);
      throw new BusinessException(AuthErrorMap.AUTH_REFRESH_TOKEN_UNAUTHORIZED);
    }

    try {
      this.jwtService.verify(refreshToken, {
        secret: appConfig.jwtRefreshTokenSecret,
      });
    } catch (e) {
      await this.redisClient.del(`userId:${payload.userId}:refreshToken`);
      throw new BusinessException(AuthErrorMap.AUTH_REFRESH_TOKEN_UNAUTHORIZED, e.message);
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
