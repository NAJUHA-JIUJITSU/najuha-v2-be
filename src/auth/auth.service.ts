import { Injectable } from '@nestjs/common';
import { AuthSnsLoginDto } from './dto/auth-sns-login.dto';
import { UserService } from 'src/user/user.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/user.entity';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private refreshTokens: string[] = [];

  async snsLogin(dto: AuthSnsLoginDto): Promise<AuthTokens> {
    let KakaoUserInfo: any;
    try {
      // 카카오에서 액세스 토큰을 받아옵니다.
      const accessToken = await this.getKakaoAccessToken(dto.authCode);
      console.log('액세스 토큰:', accessToken);

      // 액세스 토큰을 사용하여 카카오로부터 사용자 정보를 받아옵니다.
      KakaoUserInfo = await this.getKaKaoUserInfo(accessToken);
      console.log('사용자 정보:', KakaoUserInfo);
    } catch (error) {
      console.error('SNS 로그인 과정에서 오류 발생:', error);
      throw new Error('SNS 로그인 실패');
    }

    const parsedUser = this.parseKakaoUserInfo(KakaoUserInfo);
    let user = await this.userService.getUserById(KakaoUserInfo.id);
    // 가입자 정보 판단
    if (!user) {
      // 새로운 가입자는 생성
      user = await this.userService.createUser(parsedUser);
    }
    // else { 업데이트 굳이 안해도 될거 같음.
    //   // 기존 가입자는 업데이트
    //   await this.userService.updateUser(KakaoUserInfo.id, parsedUser);
    // }

    // JWT 토큰 생성
    const tokens = await this.generateJwtTokens(user);
    return tokens;
  }

  private async getKakaoAccessToken(authCode: string): Promise<string> {
    const tokenUrl = 'https://kauth.kakao.com/oauth/token';
    const tokenRequestData = new URLSearchParams();
    tokenRequestData.append(
      'grant_type',
      this.configService.get<string>('KAKAO_GRANT_TYPE')!,
    );
    tokenRequestData.append(
      'client_id',
      this.configService.get<string>('KAKAO_CLIENT_ID')!,
    );
    tokenRequestData.append(
      'redirect_uri',
      this.configService.get<string>('KAKAO_REDIRECT_URI')!,
    );
    tokenRequestData.append('code', authCode);

    const response = await lastValueFrom(
      this.httpService.post(tokenUrl, tokenRequestData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    );

    return response.data.access_token;
  }

  private async getKaKaoUserInfo(accessToken: string): Promise<any> {
    const userInfoUrl = 'https://kapi.kakao.com/v2/user/me';

    try {
      const response = await lastValueFrom(
        this.httpService.get(userInfoUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        }),
      );

      return response.data;
    } catch (error) {
      console.error('카카오 사용자 정보 요청 실패:', error);
      throw new Error('사용자 정보 요청 실패');
    }
  }

  //KakaoUserInfo를 이용해서 UserDto에 맞는 값으로 파싱
  private parseKakaoUserInfo(SnsUserInfo: any): any {
    return {
      snsId: SnsUserInfo.id,
      snsProvider: 'KAKAO',
      email: SnsUserInfo.kakao_account.email,
      name: SnsUserInfo.properties.nickname,
      nickname: SnsUserInfo.properties.nickname,
      phoneNumber: SnsUserInfo.kakao_account.phone_number,
    };
  }

  private async generateJwtTokens(
    user: UserEntity,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { userId: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: '15m', // AccessToken: 15분
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: '7d', // RefreshToken: 7일
    });

    this.saveRefreshToken(refreshToken);
    return { accessToken, refreshToken };
  }

  private saveRefreshToken(token: string) {
    this.refreshTokens.push(token);
  }

  public isRefreshTokenValid(token: string): boolean {
    return this.refreshTokens.includes(token);
  }

  public deleteRefreshToken(token: string) {
    this.refreshTokens = this.refreshTokens.filter((t) => t !== token);
  }
}
