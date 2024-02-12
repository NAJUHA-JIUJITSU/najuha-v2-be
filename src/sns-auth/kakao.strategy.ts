import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { KakaoUserData } from 'src/sns-auth/types/kakao-user-data.interface';
import { SnsAuthStrategy } from 'src/sns-auth/types/sns-auth.strategy.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { BusinessException, SnsAuthErrorMap } from 'src/common/response/errorResponse';
import appConfig from 'src/common/appConfig';

@Injectable()
export class KakaoStrategy implements SnsAuthStrategy {
  constructor(private readonly httpService: HttpService) {}

  async validate(snsAuthCode: string): Promise<CreateUserDto> {
    try {
      const snsAccessToken = await this.getAccessToken(snsAuthCode);
      const kakaoUserData = await this.getUserData(snsAccessToken);

      return this.convertUserDataToCreateUserDto(kakaoUserData);
    } catch (e) {
      throw new BusinessException(SnsAuthErrorMap.SNS_AUTH_KAKAO_LOGIN_FAIL, e.response.data);
    }
  }

  private async getAccessToken(snsAuthCode: string): Promise<string> {
    const clientId = appConfig.kakaoRestApiKey;
    const redirectUri = appConfig.kakaoCallbackUrl;

    const response = await lastValueFrom(
      this.httpService.post(
        'https://kauth.kakao.com/oauth/token',
        `grant_type=authorization_code&client_id=${clientId}&redirect_uri=${redirectUri}&code=${snsAuthCode}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );

    return response.data.access_token;
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
      phoneNumber: data.kakao_account.phone_number.replace(/[-\s]/g, ''), //'-', ' ' 제거
      gender: data.kakao_account.gender === 'male' ? 'MALE' : 'FEMALE', // TODO: type으로 관리
      birth: data.kakao_account.birthyear + data.kakao_account.birthday,
    };
    return dto;
  }
}
