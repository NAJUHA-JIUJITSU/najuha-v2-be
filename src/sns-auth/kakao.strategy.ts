import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { KakaoUserData } from './types/kakao-user-data.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SnsAuthStrategy } from './types/sns-auth.strategy.interface';
import { BusinessException } from 'src/common/response/errorResponse';
import { SnsAuthErrorMap } from './sns-auth.error';

@Injectable()
export class KakaoStrategy implements SnsAuthStrategy {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async validate(snsAuthCode: string, authState: string) {
    const snsAccessToken = await this.getAccessToken(snsAuthCode, authState);
    const kakaoUserData = await this.getUserData(snsAccessToken);

    return this.convertUserDataToCreateUserDto(kakaoUserData);
  }

  private async getAccessToken(
    snsAuthCode: string,
    authState: string,
  ): Promise<string> {
    const clientId = this.configService.get<string>('KAKAO_REST_API_KEY');
    const redirectUri = this.configService.get<string>('KAKAO_CALLBACK_URL');

    try {
      const response = await lastValueFrom(
        this.httpService.post(
          'https://kauth.kakao.com/oauth/token',
          `grant_type=authorization_code&client_id=${clientId}&redirect_uri=${redirectUri}&code=${snsAuthCode}&state=${authState}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );

      return response.data.access_token;
    } catch (e) {
      throw new BusinessException(
        SnsAuthErrorMap.SNS_AUTH_KAKAO_LOGIN_ERROR,
        e.response.data,
      );
    }
  }

  private async getUserData(acessToken: string): Promise<KakaoUserData> {
    const response = await lastValueFrom(
      this.httpService.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${acessToken}`,
        },
      }),
    );
    return response.data;
  }

  private convertUserDataToCreateUserDto(data: KakaoUserData): CreateUserDto {
    const dto: CreateUserDto = {
      snsAuthProvider: 'KAKAO', // TODO: type으로 관리
      snsId: data.id.toString(),
      name: data.kakao_account.name,
      email: data.kakao_account.email,
      phoneNumber: data.kakao_account.phone_number,
      gender: data.kakao_account.gender === 'male' ? 'MALE' : 'FEMALE', // TODO: type으로 관리
    };
    return dto;
  }
}
