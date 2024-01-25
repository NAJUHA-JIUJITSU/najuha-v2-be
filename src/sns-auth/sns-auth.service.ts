import { Injectable } from '@nestjs/common';
import { SnsAuthDto } from './dto/sns-auth.dto';
import {
  BusinessException,
  SnsAuthErrorMap,
} from 'src/common/response/errorResponse';
import { NaverStrategy } from './naver.strategy';
import { KakaoStrategy } from './kakao.strategy';
import { GoogleStrategy } from './google.strategy';

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
