import { Injectable } from '@nestjs/common';
import {
  BusinessException,
  SnsAuthErrorMap,
} from 'src/common/response/errorResponse';
import { GoogleStrategy } from 'src/sns-auth/google.strategy';
import { KakaoStrategy } from 'src/sns-auth/kakao.strategy';
import { NaverStrategy } from 'src/sns-auth/naver.strategy';
import { SnsAuthDto } from 'src/sns-auth/dto/sns-auth.dto';

@Injectable()
export class SnsAuthService {
  constructor(
    private readonly kakaoStrategy: KakaoStrategy,
    private readonly naverStrategy: NaverStrategy,
    private readonly googleStrategy: GoogleStrategy,
    // private readonly appleStrategy: AppleStrategy,
  ) {}

  async validate(snsAuthDto: SnsAuthDto) {
    const { snsAuthProvider, snsAuthCode } = snsAuthDto;

    switch (snsAuthProvider) {
      // TODO: enum 으로 변경후 하나로 관리하기 (case UserEntity['snsProvider'].KAKAO:)
      case 'KAKAO':
        return await this.kakaoStrategy.validate(snsAuthCode);
      case 'NAVER':
        return await this.naverStrategy.validate(snsAuthCode);
      case 'GOOGLE':
        return await this.googleStrategy.validate(snsAuthCode);
      default:
        throw new BusinessException(
          SnsAuthErrorMap.SNS_AUTH_NOT_SUPPORTED_SNS_PROVIDER,
        );
    }
  }
}
