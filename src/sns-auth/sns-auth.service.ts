import { Injectable } from '@nestjs/common';
import { KakaoStrategy } from './kakao.strategy';
import { SnsAuthDto } from './dto/sns-auth.dto';
import { NaverStrategy } from './naver.strategy';
import {
  BusinessException,
  SnsAuthErrorMap,
} from 'src/common/response/errorResponse';

@Injectable()
export class SnsAuthService {
  constructor(
    private readonly kakaoStrategy: KakaoStrategy,
    private readonly naverStrategy: NaverStrategy,
    // private readonly googleStrategy: GoogleStrategy,
    // private readonly appleStrategy: AppleStrategy,
  ) {}

  async validate(snsAuthDto: SnsAuthDto) {
    const { snsAuthProvider, snsAuthCode, snsAuthState } = snsAuthDto;

    switch (snsAuthProvider) {
      // TODO: enum 으로 변경후 하나로 관리하기 (case UserEntity['snsProvider'].KAKAO:)
      case 'KAKAO':
        return await this.kakaoStrategy.validate(snsAuthCode, snsAuthState);
      case 'NAVER':
        return await this.naverStrategy.validate(snsAuthCode, snsAuthState);
      //  'GOOGLE':
      //     return await this.googleStrategy.getUserData(snsAuthCode, snsAuthState);
      //   'APPLE':
      //     return await this.appleStrategy.getUserData(snsAuthCode, snsAuthState);
      default:
        throw new BusinessException(
          SnsAuthErrorMap.SNS_AUTH_NOT_SUPPORTED_SNS_PROVIDER,
        );
    }
  }
}
