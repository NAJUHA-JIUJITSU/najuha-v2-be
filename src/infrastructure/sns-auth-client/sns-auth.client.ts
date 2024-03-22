import { Injectable } from '@nestjs/common';
import { BusinessException, SnsAuthErrorMap } from 'src/common/response/errorResponse';
import { GoogleStrategy } from 'src/infrastructure/sns-auth-client/google.strategy';
import { KakaoStrategy } from 'src/infrastructure/sns-auth-client/kakao.strategy';
import { NaverStrategy } from 'src/infrastructure/sns-auth-client/naver.strategy';
import { SnsLoginReqDto } from 'src/modules/auth/dto/request/sns-login.dto';
import { CreateUserReqDto } from 'src/modules/users/dto/request/create-user.req.dto';

@Injectable()
export class SnsAuthClient {
  constructor(
    private readonly kakaoStrategy: KakaoStrategy,
    private readonly naverStrategy: NaverStrategy,
    private readonly googleStrategy: GoogleStrategy,
    // private readonly appleStrategy: AppleStrategy,
  ) {}

  async validate(SnsLoginReqDto: SnsLoginReqDto): Promise<CreateUserReqDto> {
    const { snsAuthProvider, snsAuthCode } = SnsLoginReqDto;

    switch (snsAuthProvider) {
      // TODO: enum 으로 변경후 하나로 관리하기 (case User['snsProvider'].KAKAO:)
      case 'KAKAO':
        return await this.kakaoStrategy.validate(snsAuthCode);
      case 'NAVER':
        return await this.naverStrategy.validate(snsAuthCode);
      case 'GOOGLE':
        return await this.googleStrategy.validate(snsAuthCode);
      default:
        throw new BusinessException(SnsAuthErrorMap.SNS_AUTH_NOT_SUPPORTED_SNS_PROVIDER);
    }
  }
}
