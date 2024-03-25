import { TypedBody, TypedException, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { SnsLoginReqDto } from 'src/modules/auth/dto/request/sns-login.dto';
import { AuthAppService } from 'src/modules/auth/application/auth.app.service';
import { AuthTokensResDto } from 'src/modules/auth/dto/response/auth-tokens.res.dto';
import {
  AUTH_REFRESH_TOKEN_UNAUTHORIZED,
  AUTH_UNREGISTERED_ADMIN_CREDENTIALS,
  ENTITY_NOT_FOUND,
  SNS_AUTH_GOOGLE_LOGIN_FAIL,
  SNS_AUTH_KAKAO_LOGIN_FAIL,
  SNS_AUTH_NAVER_LOGIN_FAIL,
  SNS_AUTH_NOT_SUPPORTED_SNS_PROVIDER,
} from 'src/common/response/errorResponse';
import { RefreshTokenReqDto } from '../dto/request/refresh-token.dto';
import { RoleLevel, RoleLevels } from '../../../infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';

@Controller('user/auth')
export class UserAuthController {
  constructor(private readonly AuthAppService: AuthAppService) {}

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
  async snsLogin(@TypedBody() dto: SnsLoginReqDto): Promise<ResponseForm<AuthTokensResDto>> {
    const authTokens = await this.AuthAppService.snsLogin(dto);
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
  async refreshToken(@TypedBody() dto: RefreshTokenReqDto): Promise<ResponseForm<AuthTokensResDto>> {
    const authTokens = await this.AuthAppService.refreshToken(dto);
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
  @TypedException<ENTITY_NOT_FOUND>(404, 'ENTITY_NOT_FOUND')
  @TypedException<AUTH_UNREGISTERED_ADMIN_CREDENTIALS>(1004, 'AUTH_UNREGISTERED_ADMIN_CREDENTIALS')
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Patch('acquire-admin-role')
  async aqureAdminRole(@Req() req: Request): Promise<ResponseForm<AuthTokensResDto>> {
    const authTokens = await this.AuthAppService.acquireAdminRole(req['userId']);
    return createResponseForm(authTokens);
  }
}
