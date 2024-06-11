import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GoogleStrategy } from './google.strategy';
import { KakaoStrategy } from './kakao.strategy';
import { NaverStrategy } from './naver.strategy';
import { SnsAuthClient } from './sns-auth.client';

@Module({
  imports: [HttpModule],
  providers: [SnsAuthClient, KakaoStrategy, NaverStrategy, GoogleStrategy],
  exports: [SnsAuthClient],
})
export class SnsAuthModule {}
