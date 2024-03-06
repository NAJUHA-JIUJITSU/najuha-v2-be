import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GoogleStrategy } from 'src/sns-auth/google.strategy';
import { KakaoStrategy } from 'src/sns-auth/kakao.strategy';
import { NaverStrategy } from 'src/sns-auth/naver.strategy';
import { SnsAuthClient } from './sns-auth.client';

@Module({
  imports: [HttpModule],
  providers: [SnsAuthClient, KakaoStrategy, NaverStrategy, GoogleStrategy],
  exports: [SnsAuthClient],
})
export class SnsAuthModule {}
