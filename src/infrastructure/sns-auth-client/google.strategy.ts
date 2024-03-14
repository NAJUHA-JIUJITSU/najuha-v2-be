import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { GoogleUserData } from 'src/infrastructure/sns-auth-client/types/google-user-data.type';
import { SnsAuthStrategy } from 'src/infrastructure/sns-auth-client/types/sns-auth.strategy.type';
import { CreateUserReqDto } from 'src/modules/users/dto/request/create-user.req.dto';
import { BusinessException, SnsAuthErrorMap } from 'src/common/response/errorResponse';
import appEnv from 'src/common/app-env';

@Injectable()
export class GoogleStrategy implements SnsAuthStrategy {
  constructor(private readonly httpService: HttpService) {}

  async validate(snsAuthCode: string): Promise<CreateUserReqDto> {
    try {
      const accessToken = await this.getAccessToken(snsAuthCode);
      const userData = await this.getUserData(accessToken);
      console.log(userData);

      return this.convertUserDataToCreateUserReqDto(userData);
    } catch (e) {
      throw new BusinessException(SnsAuthErrorMap.SNS_AUTH_GOOGLE_LOGIN_FAIL, e.response.data);
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

  convertUserDataToCreateUserReqDto(data: any): CreateUserReqDto {
    const dto: CreateUserReqDto = {
      snsAuthProvider: 'GOOGLE',
      snsId: data.sub,
      name: data.name.replace(/\s/g, ''),
      email: data.email,
    };

    return dto;
  }
}
