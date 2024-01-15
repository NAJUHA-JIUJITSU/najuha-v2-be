import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypedBody, TypedRoute } from '@nestia/core';
import { AuthSnsLoginDto } from './dto/auth-sns-login.dto';

export interface KakaoLogin {
  accessToken: string;
  refreshToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 1-1 auth sns login.
   *
   * @tag auth
   * @return KakaoLogin
   */
  @TypedRoute.Post('kakao')
  kakaoLogin(@TypedBody() dto: AuthSnsLoginDto): Promise<KakaoLogin> {

    return this.authService.kakaoLogin(dto);
  }
}
