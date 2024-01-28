import { TypedBody, TypedException, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { SnsAuthDto } from 'src//sns-auth/dto/sns-auth.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthTokensDto } from 'src/auth/dto/auth-tokens.dto';
import { AUTH_REFRESH_TOKEN_UNAUTHORIZED } from 'src/common/response/errorResponse';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { GuardLevel, SetGuardLevel } from './auth.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 1-1 auth sns login.
   *
   * @tag 1 auth
   * @return accessToken and refreshToken
   */
  @SetGuardLevel(GuardLevel.PUBLIC)
  @TypedRoute.Post('snsLogin')
  async snsLogin(
    @TypedBody() dto: SnsAuthDto,
  ): Promise<ResponseForm<AuthTokensDto>> {
    return createResponseForm(await this.authService.snsLogin(dto));
  }

  /**
   * 1-2 auth toekn refresh.
   *
   * @tag 1 auth
   * @return accessToken and refreshToken
   */
  @TypedException<AUTH_REFRESH_TOKEN_UNAUTHORIZED>(
    4001,
    'AUTH_REFRESH_TOKEN_UNAUTHORIZED',
  )
  @SetGuardLevel(GuardLevel.PUBLIC)
  @TypedRoute.Post('refresh')
  async refreshToken(
    @TypedBody() dto: RefreshTokenDto,
  ): Promise<ResponseForm<AuthTokensDto>> {
    return createResponseForm(await this.authService.refreshToken(dto));
  }
}
