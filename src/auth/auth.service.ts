import { Injectable } from '@nestjs/common';
import { AuthSnsLoginDto } from './dto/auth-sns-login.dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async snsLogin(dto: AuthSnsLoginDto): Promise<string> {
    try {
      const client_id = this.configService.get<string>('KAKAO_REST_API_KEY');
      const client_secret =
        this.configService.get<string>('KAKAO_CALLBACK_URL');

      console.log(client_id);

      // 카카오 OAuth 서버에게 access token 요청
      const response: AxiosResponse<any> = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        `grant_type=authorization_code&client_id=${client_id}&redirect_uri=${redirect_uri}&code=${sns_auth_code}&client_secret=${client_secret}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      // 응답에서 access token 추출
      const accessToken = response.data.access_token;

      return accessToken;
    } catch (error) {
      console.error('Error during SNS login:', error);
      throw new Error('SNS Login failed.'); // 적절한 에러 처리를 추가해 주세요.
    }
  }
}
