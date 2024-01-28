import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { GoogleUserData } from 'src/sns-auth/types/google-user-data.interface';
import { SnsAuthStrategy } from 'src/sns-auth/types/sns-auth.strategy.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import {
  BusinessException,
  SnsAuthErrorMap,
} from 'src/common/response/errorResponse';
import appConfig from 'src/common/appConfig';

@Injectable()
export class GoogleStrategy implements SnsAuthStrategy {
  constructor(private readonly httpService: HttpService) {}

  async validate(snsAuthCode: string): Promise<CreateUserDto> {
    try {
      const accessToken = await this.getAccessToken(snsAuthCode);
      const userData = await this.getUserData(accessToken);
      console.log(userData);

      return this.convertUserDataToCreateUserDto(userData);
    } catch (e) {
      throw new BusinessException(
        SnsAuthErrorMap.SNS_AUTH_GOOGLE_LOGIN_FAIL,
        e.response.data,
      );
    }
  }

  private async getAccessToken(snsAuthCode: string): Promise<string> {
    const clientId = appConfig.googleClientId;
    const clientSecret = appConfig.googleClientSecret;
    const redirectUri = appConfig.googleCallbackUrl;

    const response = await lastValueFrom(
      this.httpService.post(
        'https://oauth2.googleapis.com/token',
        `code=${snsAuthCode}&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&grant_type=authorization_code`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );

    return response.data.access_token;
  }

  private async getUserData(accessToken: string): Promise<GoogleUserData> {
    const response = await lastValueFrom(
      this.httpService.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );
    return response.data;
  }

  convertUserDataToCreateUserDto(data: any): CreateUserDto {
    const dto: CreateUserDto = {
      snsAuthProvider: 'GOOGLE',
      snsId: data.sub,
      name: data.name,
      email: data.email,
      phoneNumber: null,
      gender: null,
    };

    return dto;
  }
}
