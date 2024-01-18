import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SnsAuthDto } from '../sns-auth/dto/sns-auth.dto';
import { UsersService } from '..//users/users.service';
import { UserEntity } from '..//users/entities/user.entity';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { SnsAuthService } from 'src/sns-auth/sns-auth.service';

// TODO: 에러처리 *
// TODO: logging *
// TODO: test code 작성 *
// TODO: 다른 SNS 로그인 추가 및 모듈화 (passport 사용?)
// TODO: refresh token redis로 관리
// TODO: AuthGuard 로 인증처리
@Injectable()
export class AuthService {
  private refreshTokens: string[] = []; // TODO: redis로 변경

  constructor(
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

    return {
      accessToken: this.createAccessToken(user.id, user.role),
      refreshToken: this.createRefreshToken(user.id, user.role),
    };
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

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      ),
    });

    this.refreshTokens.push(refreshToken);
    return refreshToken;
  }
}
