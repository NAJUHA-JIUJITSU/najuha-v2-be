import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SnsAuthService } from './sns-auth.service';
import { KakaoStrategy } from './kakao.strategy';
import { NaverStrategy } from './naver.strategy';

@Module({
  imports: [HttpModule],
  providers: [SnsAuthService, KakaoStrategy, NaverStrategy],
  exports: [SnsAuthService],
})
export class SnsAuthModule {}
