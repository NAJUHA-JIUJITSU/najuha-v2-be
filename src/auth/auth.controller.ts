import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypedBody, TypedRoute } from '@nestia/core';
import { SnsAuthDto } from '../sns-auth/dto/sns-auth.dto';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { ResponseForm, createResponseForm } from 'src/common/response';
import { AuthLevel, SetAuthLevel } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 1-1 auth sns login.
   *
   * @tag 1 auth
   * @return accessToken and refreshToken
   */
  @SetAuthLevel(AuthLevel.PUBLIC)
  @TypedRoute.Post('snsLogin')
  async snsLogin(
    @TypedBody() dto: SnsAuthDto,
  ): Promise<ResponseForm<AuthTokensDto>> {
    return createResponseForm(await this.authService.snsLogin(dto));
  }
}
