import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SnsAuthStrategy } from './types/sns-auth.strategy.interface';
import { NaverUserData } from './types/naver-user-data.interface';

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

    if (!response.data || !response.data.access_token) {
      throw new Error('Failed to retrieve access token'); // TODO: 에러표준화
    }

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
      phoneNumber: data.mobile,
      gender: data.gender === 'M' ? 'MALE' : 'FEMALE', // TODO: type으로 관리
    };
    return dto;
  }
}
