import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { NaverUserData } from 'src/sns-auth/types/naver-user-data.type';
import { SnsAuthStrategy } from 'src/sns-auth/types/sns-auth.strategy.type';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { BusinessException, SnsAuthErrorMap } from 'src/common/response/errorResponse';
import appConfig from 'src/common/appConfig';

@Injectable()
export class NaverStrategy implements SnsAuthStrategy {
  constructor(private readonly httpService: HttpService) {}

  async validate(snsAuthCode: string): Promise<CreateUserDto> {
    try {
      const snsAccessToken = await this.getAccessToken(snsAuthCode);
      const naverUserData = await this.getUserData(snsAccessToken);

      return this.convertUserDataToCreateUserDto(naverUserData);
    } catch (e) {
      throw new BusinessException(SnsAuthErrorMap.SNS_AUTH_NAVER_LOGIN_FAIL, e.response.data);
    }
  }

  private async getAccessToken(snsAuthCode: string): Promise<string> {
    const clientId = appConfig.naverClientId;
    const clientSecret = appConfig.naverClientSecret;
    const redirectUri = appConfig.naverCallbackUrl;

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

  private async getUserData(accessToken: string): Promise<NaverUserData> {
    const response = await lastValueFrom(
      this.httpService.get('https://openapi.naver.com/v1/nid/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    return response.data.response;
  }

  private convertUserDataToCreateUserDto(data: NaverUserData): CreateUserDto {
    const dto: CreateUserDto = {
      snsAuthProvider: 'NAVER', // TODO: type으로 관리
      snsId: data.id,
      name: data.name,
      email: data.email,
      phoneNumber: data.mobile_e164,
      gender: data.gender === 'M' ? 'MALE' : 'FEMALE', // TODO: type으로 관리
      birth: data.birthyear + data.birthday.split('-').join(''),
    };
    return dto;
  }
}
