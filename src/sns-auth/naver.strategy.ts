import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SnsAuthStrategy } from './types/sns-auth.strategy.interface';
import { NaverUserData } from './types/naver-user-data.interface';
import {
  BusinessException,
  SnsAuthErrorMap,
} from 'src/common/response/errorResponse';

@Injectable()
export class NaverStrategy implements SnsAuthStrategy {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async validate(snsAuthCode: string, authState: string) {
    const snsAccessToken = await this.getAccessToken(snsAuthCode, authState);
    const naverUserData = await this.getUserData(snsAccessToken);

    return this.convertUserDataToCreateUserDto(naverUserData);
  }

  private async getAccessToken(
    snsAuthCode: string,
    authState: string,
  ): Promise<string> {
    const clientId = this.configService.get<string>('NAVER_CLIENT_ID');
    const clientSecret = this.configService.get<string>('NAVER_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('NAVER_CALLBACK_URL');

    try {
      const response = await lastValueFrom(
        this.httpService.post(
          'https://nid.naver.com/oauth2.0/token',
          `grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&code=${snsAuthCode}&state=${authState}`,
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
        SnsAuthErrorMap.SNS_AUTH_NAVER_LOGIN_FAIL,
        e.response.data,
      );
    }
  }

  private async getUserData(accessToken: string): Promise<NaverUserData> {
    try {
      const response = await lastValueFrom(
        this.httpService.get('https://openapi.naver.com/v1/nid/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      return response.data.response;
    } catch (e) {
      throw new BusinessException(
        SnsAuthErrorMap.SNS_AUTH_NAVER_LOGIN_FAIL,
        e.response.data,
      );
    }
  }

  private convertUserDataToCreateUserDto(data: NaverUserData): CreateUserDto {
    const dto: CreateUserDto = {
      snsAuthProvider: 'NAVER', // TODO: type으로 관리
      snsId: data.id,
      name: data.name,
      email: data.email,
      phoneNumber: data.mobile,
      gender: data.gender === 'M' ? 'MALE' : 'FEMALE', // TODO: type으로 관리
    };
    return dto;
  }
}
