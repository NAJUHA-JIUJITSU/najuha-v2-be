import { Injectable } from '@nestjs/common';
import { BusinessException, SnsAuthErrors } from 'src/common/response/errorResponse';
import { GoogleStrategy } from 'src/modules/sns-auth-client/google.strategy';
import { KakaoStrategy } from 'src/modules/sns-auth-client/kakao.strategy';
import { NaverStrategy } from 'src/modules/sns-auth-client/naver.strategy';
import { SnsLoginParam } from '../auth/application/auth.app.dto';
import { ISnsAuthValidatedUserData } from './interface/validated-user-data.interface';

@Injectable()
export class SnsAuthClient {
  constructor(
    private readonly kakaoStrategy: KakaoStrategy,
    private readonly naverStrategy: NaverStrategy,
    private readonly googleStrategy: GoogleStrategy,
    // private readonly appleStrategy: AppleStrategy,
  ) {}

  async validate({ snsAuthProvider, snsAuthCode }: SnsLoginParam): Promise<ISnsAuthValidatedUserData> {
    switch (snsAuthProvider) {
      case 'KAKAO':
        return await this.kakaoStrategy.validate(snsAuthCode);
      case 'NAVER':
        return await this.naverStrategy.validate(snsAuthCode);
      case 'GOOGLE':
        return await this.googleStrategy.validate(snsAuthCode);
      default:
        throw new BusinessException(SnsAuthErrors.SNS_AUTH_NOT_SUPPORTED_SNS_PROVIDER);
    }
  }
}
