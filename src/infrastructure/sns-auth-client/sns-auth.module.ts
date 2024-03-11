import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GoogleStrategy } from 'src/infrastructure/sns-auth-client/application/google.strategy';
import { KakaoStrategy } from 'src/infrastructure/sns-auth-client/application/kakao.strategy';
import { NaverStrategy } from 'src/infrastructure/sns-auth-client/application/naver.strategy';
import { SnsAuthClient } from './sns-auth.client';

@Module({
  imports: [HttpModule],
  providers: [SnsAuthClient, KakaoStrategy, NaverStrategy, GoogleStrategy],
  exports: [SnsAuthClient],
})
export class SnsAuthModule {}
