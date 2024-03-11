import { Injectable } from '@nestjs/common';
import { BusinessException, SnsAuthErrorMap } from 'src/common/response/errorResponse';
import { GoogleStrategy } from 'src/infrastructure/sns-auth-client/application/google.strategy';
import { KakaoStrategy } from 'src/infrastructure/sns-auth-client/application/kakao.strategy';
import { NaverStrategy } from 'src/infrastructure/sns-auth-client/application/naver.strategy';
import { SnsAuthDto } from 'src/modules/auth/presentation/dto/sns-auth.dto';
import { CreateUserDto } from 'src/modules/users/presentation/dto/create-user.dto';

@Injectable()
export class SnsAuthClient {
  constructor(
    private readonly kakaoStrategy: KakaoStrategy,
    private readonly naverStrategy: NaverStrategy,
    private readonly googleStrategy: GoogleStrategy,
    // private readonly appleStrategy: AppleStrategy,
  ) {}

  async validate(snsAuthDto: SnsAuthDto): Promise<CreateUserDto> {
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
        throw new BusinessException(SnsAuthErrorMap.SNS_AUTH_NOT_SUPPORTED_SNS_PROVIDER);
    }
  }
}
