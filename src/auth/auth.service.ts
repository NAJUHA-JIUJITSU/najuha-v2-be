import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AuthSnsLoginDto } from './dto/auth-sns-login.dto';
import { UsersService } from '..//users/users.service';
import { CreateUserDto } from '..//users/dto/create-user.dto';
import { KakaoUserResponseData } from './types/kakao-user-response-data.type';
import { UserEntity } from '..//users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  refreshTokens: string[] = []; // TODO: redis로 변경

  // TODO: 에러처리
  // TODO: logging
  // TODO: 다른 SNS 로그인 추가 및 모듈화 (passport 사용)
  // TODO: test code 작성
  async kakaoLogin(
    authSnsLoginDto: AuthSnsLoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const sns_auth_code = authSnsLoginDto.snsAuthCode;
    const snsAccessToken = await this.getKakaoAccessToken(sns_auth_code);
    const kakaoUserResponseData = await this.getKakaoUserInfo(snsAccessToken);

    let user = await this.usersService.findUserBySnsIdaAndSnsProvider(
      kakaoUserResponseData.id,
      'KAKAO',
    );

    if (!user) user = await this.createKakaoUser(kakaoUserResponseData);

    return {
      accessToken: this.createAccessToken(user.id, user.role),
      refreshToken: this.createRefreshToken(user.id, user.role),
    };
  }

  private async getKakaoAccessToken(sns_auth_code: string): Promise<string> {
    const client_id = this.configService.get<string>('KAKAO_REST_API_KEY');
    const redirect_uri = this.configService.get<string>('KAKAO_CALLBACK_URL');

    const response = await lastValueFrom(
      this.httpService.post(
        'https://kauth.kakao.com/oauth/token',
        `grant_type=authorization_code&client_id=${client_id}&redirect_uri=${redirect_uri}&code=${sns_auth_code}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );

    if (!response.data || !response.data.access_token) {
      throw new Error('Failed to retrieve access token');
    }

    return response.data.access_token;
  }

  private async getKakaoUserInfo(
    acessToken: string,
  ): Promise<KakaoUserResponseData> {
    const response = await lastValueFrom(
      this.httpService.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${acessToken}`,
        },
      }),
    );
    response.data.id = response.data.id.toString();
    return response.data;
  }

  private async createKakaoUser(
    kakaoUserResponseData: KakaoUserResponseData,
  ): Promise<UserEntity> {
    const createUserDto: CreateUserDto = {
      snsId: kakaoUserResponseData.id,
      snsProvider: 'KAKAO',
      name: kakaoUserResponseData.kakao_account.name,
      email: kakaoUserResponseData.kakao_account.email,
      phoneNumber: kakaoUserResponseData.kakao_account.phone_number,
      gender: kakaoUserResponseData.kakao_account.gender,
    };
    console.log(createUserDto);

    return await this.usersService.createUser(createUserDto);
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
