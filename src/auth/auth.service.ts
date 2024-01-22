import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SnsAuthDto } from '../sns-auth/dto/sns-auth.dto';
import { UsersService } from '..//users/users.service';
import { UserEntity } from '..//users/entities/user.entity';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { SnsAuthService } from 'src/sns-auth/sns-auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import Redis from 'ioredis';
import { BusinessException } from 'src/common/response/errorResponse';
import { AuthErrorMap } from './auth.error';

// TODO: 에러처리 *
// TODO: logging *
// TODO: test code 작성 *
// TODO: 다른 SNS 로그인 추가 및 모듈화 kakao, naver *
// TODO: AuthGuard 로 인증처리 *
// TODO: token refresh 로직 구현 *
// TODO: refresh token redis로 관리 *
// TODO: 에러 표준화 *
// TODO: 타입 정의
// TODO: 토큰 탈취 테스트 작성
@Injectable()
export class AuthService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly snsAuthService: SnsAuthService,
  ) {}

  async snsLogin(snsAuthDto: SnsAuthDto): Promise<AuthTokensDto> {
    const userData = await this.snsAuthService.validate(snsAuthDto);

    let user = await this.usersService.findUserBySnsIdAndProvider(
      userData.snsAuthProvider,
      userData.snsId,
    );

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

    const newAccessToken = this.createAccessToken(
      payload.userId,
      payload.userRole,
    );
    const newRefreshToken = this.createRefreshToken(
      payload.userId,
      payload.userRole,
    );

    await this.redisClient.set(
      `userId:${payload.userId}:refreshToken`,
      newRefreshToken,
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  private createAccessToken(
    userId: UserEntity['id'],
    userRole: UserEntity['role'],
  ): string {
    const payload = { userId, userRole };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      ),
    });
  }

  private createRefreshToken(
    userId: UserEntity['id'],
    userRole: UserEntity['role'],
  ): string {
    const payload = { userId, userRole };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      ),
    });
  }

  private async verifyRefreshToken(refreshToken: string): Promise<any> {
    const payload = this.jwtService.decode(refreshToken);

    const storedRefreshToken = await this.redisClient.get(
      `userId:${payload.userId}:refreshToken`,
    );

    try {
      if (!storedRefreshToken || storedRefreshToken !== refreshToken)
        throw new BusinessException(AuthErrorMap.AUTH_REFRESH_TOKEN_NOT_FOUND);

      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
    } catch (e) {
      // await this.redisClient.del(`userId:${payload.userId}:refreshToken`); // 없어도될듯
      throw new UnauthorizedException(e.message);
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
