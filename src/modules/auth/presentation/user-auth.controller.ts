import { TypedBody, TypedException, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { SnsAuthDto } from 'src/modules/auth/dto/sns-auth.dto';
import { AuthService } from 'src/modules/auth/application/auth.service';
import { AuthTokensDto } from 'src/modules/auth/dto/auth-tokens.dto';
import {
  AUTH_REFRESH_TOKEN_UNAUTHORIZED,
  AUTH_UNREGISTERED_ADMIN_CREDENTIALS,
  SNS_AUTH_GOOGLE_LOGIN_FAIL,
  SNS_AUTH_KAKAO_LOGIN_FAIL,
  SNS_AUTH_NAVER_LOGIN_FAIL,
  SNS_AUTH_NOT_SUPPORTED_SNS_PROVIDER,
  USERS_USER_NOT_FOUND,
} from 'src/common/response/errorResponse';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { RoleLevel, RoleLevels } from '../../../infra/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';

@Controller('user/auth')
export class UserAuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * u-1-1 auth sns login.
   * - RoleLevel: PUBLIC
   *
   * @tag u-1 auth
   * @return accessToken and refreshToken
   */
  @TypedException<SNS_AUTH_NOT_SUPPORTED_SNS_PROVIDER>(2000, 'SNS_AUTH_NOT_SUPPORTED_SNS_PROVIDER')
  @TypedException<SNS_AUTH_KAKAO_LOGIN_FAIL>(2001, 'SNS_AUTH_KAKAO_LOGIN_FAIL')
  @TypedException<SNS_AUTH_NAVER_LOGIN_FAIL>(2002, 'SNS_AUTH_NAVER_LOGIN_FAIL')
  @TypedException<SNS_AUTH_GOOGLE_LOGIN_FAIL>(2003, 'SNS_AUTH_GOOGLE_LOGIN_FAIL')
  @RoleLevels(RoleLevel.PUBLIC)
  @TypedRoute.Post('sns-login')
  async snsLogin(@TypedBody() dto: SnsAuthDto): Promise<ResponseForm<AuthTokensDto>> {
    const authTokens = await this.authService.snsLogin(dto);
    return createResponseForm(authTokens);
  }

  /**
   * u-1-2 auth toekn refresh.
   * - RoleLevel: PUBLIC
   *
   * @tag u-1 auth
   * @return accessToken and refreshToken
   */
  @TypedException<AUTH_REFRESH_TOKEN_UNAUTHORIZED>(1002, 'AUTH_REFRESH_TOKEN_UNAUTHORIZED')
  @RoleLevels(RoleLevel.PUBLIC)
  @TypedRoute.Post('token')
  async refreshToken(@TypedBody() dto: RefreshTokenDto): Promise<ResponseForm<AuthTokensDto>> {
    const authTokens = await this.authService.refreshToken(dto);
    return createResponseForm(authTokens);
  }

  /**
   * u-1-3 auth acquire admin role.
   * - RoleLevel: USER
   * - 관리자로 등록되어있는 유저를 관리자 역할로 변경합니다.
   * - ADMIN 역할을 가진 accessToken 과 refreshToken 을 발급합니다.
   *
   * @tag u-1 auth
   * @return accessToken and refreshToken
   */
  @TypedException<AUTH_UNREGISTERED_ADMIN_CREDENTIALS>(1004, 'AUTH_UNREGISTERED_ADMIN_CREDENTIALS')
  @TypedException<USERS_USER_NOT_FOUND>(4001, 'USERS_USER_NOT_FOUND')
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Patch('acquire-admin-role')
  async aqureAdminRole(@Req() req: Request): Promise<ResponseForm<AuthTokensDto>> {
    const authTokens = await this.authService.acquireAdminRole(req['userId']);
    return createResponseForm(authTokens);
  }
}
