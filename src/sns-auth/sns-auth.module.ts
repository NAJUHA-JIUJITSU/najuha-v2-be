import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GoogleStrategy } from 'src/sns-auth/google.strategy';
import { KakaoStrategy } from 'src/sns-auth/kakao.strategy';
import { NaverStrategy } from 'src/sns-auth/naver.strategy';
import { SnsAuthService } from 'src/sns-auth/sns-auth.service';

@Module({
  imports: [HttpModule],
  providers: [SnsAuthService, KakaoStrategy, NaverStrategy, GoogleStrategy],
  exports: [SnsAuthService],
})
export class SnsAuthModule {}
