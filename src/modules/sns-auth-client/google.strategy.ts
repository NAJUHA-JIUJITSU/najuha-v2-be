import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { IGoogleUserData } from 'src/modules/sns-auth-client/interface/google-user-data.interface';
import { BusinessException, SnsAuthErrors } from 'src/common/response/errorResponse';
import appEnv from 'src/common/app-env';
import { ISnsAuthStrategy } from './interface/sns-auth.stratege.interface';
import { IValidatedUserData } from './interface/validated-user-data.interface';

@Injectable()
export class GoogleStrategy implements ISnsAuthStrategy {
  constructor(private readonly httpService: HttpService) {}

  async validate(snsAuthCode: string): Promise<IValidatedUserData> {
    try {
      const accessToken = await this.getAccessToken(snsAuthCode);
      const userData = await this.getUserData(accessToken);
      console.log(userData);

      return this.formatUserData(userData);
    } catch (e: any) {
      // TODO: any 타입 수정 필요
      throw new BusinessException(SnsAuthErrors.SNS_AUTH_GOOGLE_LOGIN_FAIL, e.response.data);
    }
  }

  private async getAccessToken(snsAuthCode: string): Promise<string> {
    const clientId = appEnv.googleClientId;
    const clientSecret = appEnv.googleClientSecret;
    const redirectUri = appEnv.googleCallbackUrl;

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

  private async getUserData(accessToken: string): Promise<IGoogleUserData> {
    const response = await lastValueFrom(
      this.httpService.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );
    return response.data;
  }

  formatUserData(data: any): IValidatedUserData {
    const dto: IValidatedUserData = {
      snsAuthProvider: 'GOOGLE',
      snsId: data.sub,
      name: data.name.replace(/\s/g, ''),
      email: data.email,
    };

    return dto;
  }
}
