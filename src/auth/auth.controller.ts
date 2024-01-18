import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypedBody, TypedRoute } from '@nestia/core';
import { SnsAuthDto } from '../sns-auth/dto/sns-auth.dto';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { ResponseForm, createResponseForm } from 'src/common/response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 1-1 auth sns login.
   *
   * @tag auth
   * @return access token and refresh token
   */
  @TypedRoute.Post('snsLogin')
  async snsLogin(
    @TypedBody() dto: SnsAuthDto,
  ): Promise<ResponseForm<AuthTokensDto>> {
    return createResponseForm(await this.authService.snsLogin(dto));
  }
}
