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

    let user = await this.usersService.getUserBySnsIdAndProvider(userData.snsAuthProvider, userData.snsId);

    if (!user) user = await this.usersService.createUser(userData);

    const accessToken = this.createAccessToken(user.id, user.role);
    const refreshToken = this.createRefreshToken(user.id, user.role);

    await this.redisClient.set(`userId:${user.id}:refreshToken`, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * 1) refreshToken이 유효한지 검증
   *  1-1) redis에 저장된 refreshToken과 일치하는지 검증
   *  1-2) refreshToken이 만료 및 위조되었는지 검조
   *  1-3) 검증 실패시 redis에 userId:refreshToken 삭제 - 유저, 해커 둘다 로그인 해제 - 없어도 될듯
   * 2) 검증 성공시 새로운 accessToken, refreshToken 발급
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthTokensDto> {
    const { refreshToken } = refreshTokenDto;
    const payload = await this.verifyRefreshToken(refreshToken);

    const newAccessToken = this.createAccessToken(payload.userId, payload.userRole);
    const newRefreshToken = this.createRefreshToken(payload.userId, payload.userRole);

    await this.redisClient.set(`userId:${payload.userId}:refreshToken`, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  createAccessToken(userId: UserEntity['id'], userRole: UserEntity['role']): string {
    const payload = { userId, userRole };
    return this.jwtService.sign(payload, {
      secret: appConfig.jwtAccessTokenSecret,
      expiresIn: appConfig.jwtAccessTokenExpirationTime,
    });
  }

  createRefreshToken(userId: UserEntity['id'], userRole: UserEntity['role']): string {
    const payload = { userId, userRole };
    return this.jwtService.sign(payload, {
      secret: appConfig.jwtRefreshTokenSecret,
      expiresIn: appConfig.jwtRefreshTokenExpirationTime,
    });
  }

  private async verifyRefreshToken(refreshToken: string): Promise<any> {
    const payload = this.jwtService.decode(refreshToken);

    const storedRefreshToken = await this.redisClient.get(`userId:${payload.userId}:refreshToken`);

    if (!storedRefreshToken || storedRefreshToken !== refreshToken)
      throw new BusinessException(AuthErrorMap.AUTH_REFRESH_TOKEN_UNAUTHORIZED);

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
