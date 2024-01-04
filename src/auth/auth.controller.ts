import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypedBody, TypedRoute } from '@nestia/core';
import { AuthSnsLoginDto } from './dto/auth-sns-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 1-1 auth sns login.
   *
   * @tag auth
   * @return acessToken & refreshToken
   */
  @TypedRoute.Post('kakao')
  kakaoLogin(
    @TypedBody() dto: AuthSnsLoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.kakaoLogin(dto);
  }
}
