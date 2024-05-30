import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { BusinessException, SnsAuthErrors } from 'src/common/response/errorResponse';
import appEnv from 'src/common/app-env';
import { INaverUserData } from './interface/naver-user-data.type';
import { ISnsAuthStrategy } from './interface/sns-auth.stratege.interface';
import { ISnsAuthValidatedUserData } from './interface/validated-user-data.interface';

@Injectable()
export class NaverStrategy implements ISnsAuthStrategy {
  constructor(private readonly httpService: HttpService) {}

  async validate(snsAuthCode: string): Promise<ISnsAuthValidatedUserData> {
    try {
      const snsAccessToken = await this.getAccessToken(snsAuthCode);
      const naverUserData = await this.getUserData(snsAccessToken);

      return this.formatUserData(naverUserData);
    } catch (e: any) {
      throw new BusinessException(SnsAuthErrors.SNS_AUTH_NAVER_LOGIN_FAIL, e.response.data);
    }
  }

  private async getAccessToken(snsAuthCode: string): Promise<string> {
    const clientId = appEnv.naverClientId;
    const clientSecret = appEnv.naverClientSecret;
    const redirectUri = appEnv.naverCallbackUrl;

    const response = await lastValueFrom(
      this.httpService.post(
        'https://nid.naver.com/oauth2.0/token',
        `grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&code=${snsAuthCode}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );
    return response.data.access_token;
  }

  private async getUserData(accessToken: string): Promise<INaverUserData> {
    const response = await lastValueFrom(
      this.httpService.get('https://openapi.naver.com/v1/nid/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    return response.data.response;
  }

  private formatUserData(data: INaverUserData): ISnsAuthValidatedUserData {
    const dto: ISnsAuthValidatedUserData = {
      snsAuthProvider: 'NAVER',
      snsId: data.id,
      name: data.name,
      email: data.email,
      gender: data.gender === 'M' ? 'MALE' : 'FEMALE',
      birth: data.birthyear + data.birthday.split('-').join(''),
    };

    // +82로 시작하는 경우에만 전화번호를 저장
    if (data.mobile_e164.startsWith('+82')) {
      // '+82'를 '0'으로 바꾸고, 동시에 '-'와 공백을 모두 제거
      // 예) +82 10-1234-5678 -> 01012345678
      dto.phoneNumber = data.mobile_e164.replace('+82', '0').replace(/-/g, '');
    }
    return dto;
  }
}
