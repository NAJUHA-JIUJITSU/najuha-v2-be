import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { KakaoUserData } from 'src/infrastructure/sns-auth-client/types/kakao-user-data.type';
import { SnsAuthStrategy } from 'src/infrastructure/sns-auth-client/types/sns-auth.strategy.type';
import { CreateUserReqDto } from 'src/modules/users/dto/request/create-user.req.dto';
import { BusinessException, SnsAuthErrorMap } from 'src/common/response/errorResponse';
import appEnv from 'src/common/app-env';

@Injectable()
export class KakaoStrategy implements SnsAuthStrategy {
  constructor(private readonly httpService: HttpService) {}

  async validate(snsAuthCode: string): Promise<CreateUserReqDto> {
    try {
      const snsAccessToken = await this.getAccessToken(snsAuthCode);
      const kakaoUserData = await this.getUserData(snsAccessToken);

      return this.convertUserDataToCreateUserReqDto(kakaoUserData);
    } catch (e: any) {
      // TODO: any 타입 수정 필요
      throw new BusinessException(SnsAuthErrorMap.SNS_AUTH_KAKAO_LOGIN_FAIL, e.response.data);
    }
  }

  private async getAccessToken(snsAuthCode: string): Promise<string> {
    const clientId = appEnv.kakaoRestApiKey;
    const redirectUri = appEnv.kakaoCallbackUrl;

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

  private convertUserDataToCreateUserReqDto(data: KakaoUserData): CreateUserReqDto {
    const dto: CreateUserReqDto = {
      snsAuthProvider: 'KAKAO', // TODO: type으로 관리
      snsId: data.id.toString(),
      name: data.kakao_account.name,
      email: data.kakao_account.email,
      gender: data.kakao_account.gender === 'male' ? 'MALE' : 'FEMALE', // TODO: type으로 관리
      birth: data.kakao_account.birthyear + data.kakao_account.birthday,
    };

    // +82로 시작하는 경우에만 전화번호를 저장
    if (data.kakao_account.phone_number.startsWith('+82')) {
      // '+82'를 '0'으로 바꾸고, 동시에 '-'와 공백을 모두 제거
      // 예) +82 10-1234-5678 -> 01012345678
      dto.phoneNumber = data.kakao_account.phone_number.replace(/^\+82/, '0').replace(/[-\s]/g, '');
    }
    return dto;
  }
}
