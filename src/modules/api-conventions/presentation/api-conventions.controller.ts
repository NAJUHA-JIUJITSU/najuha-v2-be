import { TypedException, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import {
  AUTH_ACCESS_TOKEN_MISSING,
  AUTH_ACCESS_TOKEN_UNAUTHORIZED,
  AUTH_LEVEL_FORBIDDEN,
  AllErrorTypes,
} from 'src/common/response/errorResponse';
import { RoleLevel, RoleLevels } from 'src/infrastructure/guard/role.guard';
import { ApiConventionsAppService } from '../application/api-conventions.app.service';
import { CreateAdminAccessTokenRes } from './api-conventions.controller.dto';
import typia from 'typia';

/**
 * api conventions 에 대한 설명을 위한 코드입니다. (동작하지 않습니다)
 */
@Controller('api-conventions')
export class ApiConventionsController {
  constructor(private readonly apiConventionsAppService: ApiConventionsAppService) {}
  /**
   * 1 auth guard.
   * - Role Based Access Control (RBAC) 에 따라 권한이 없을 때 에러
   *
   * UserRoleLevel: PUBLIC, TEMPORARY_USER, USER, ADMIN
   * - PUBLIC: accessToken 없이 호출 가능
   * - TEMPORARY_USER: 회원가입이 완료되지 않은 사용료
   * - USER: 회원가입이 완료된 사용자
   * - ADMIN: 관리자
   *
   * @tag api-conventions
   */
  @TypedException<AUTH_ACCESS_TOKEN_MISSING>(1000, 'AUTH_ACCESS_TOKEN_MISSING')
  @TypedException<AUTH_ACCESS_TOKEN_UNAUTHORIZED>(1001, 'AUTH_ACCESS_TOKEN_UNAUTHORIZED')
  @TypedException<AUTH_LEVEL_FORBIDDEN>(1003, 'AUTH_LEVEL_FORBIDDEN')
  @TypedRoute.Get('auth-guard')
  auth() {
    return;
  }

  /**
   * 2 user api vs admin api.
   *
   * user api 비회원,사용자, 대회사 등이 사용하는 api 입니다.
   * - endpoint: /user/*
   * - RoleLevel: PUBLIC, TEMPORARY_USER, USER
   *
   * admin api 관리자가 사용하는 api 입니다.
   * - endpoint: /admin/*
   * - RoleLevel: ADMIN
   *
   * @tag api-conventions
   */
  @TypedRoute.Get('user-api-vs-admin-api')
  userApiVsAdminApi() {
    return;
  }

  /**
   * 3 find vs get.
   * - find: 조회 대상이 존재하지 않을 때 null 혹은 빈 배열을 반환
   * - get: 조회 대상이 존재하지 않을 때 에러 발생
   *
   * @tag api-conventions
   */
  @TypedRoute.Get('find-vs-get')
  findVsGet() {
    return;
  }

  /**
   * 4 update.
   * - 업데이트 하려는 대상이 존재하지 않을 때 에러 발생
   *
   * @tag api-conventions
   */
  @TypedRoute.Get('update')
  update() {
    return;
  }

  /**
   * 5 createAdminAccessToken.
   * - 관리자용 accessToken 생성
   *
   * @tag api-conventions
   */
  @RoleLevels(RoleLevel.PUBLIC)
  @TypedRoute.Post('create-admin-access-token')
  async createAdminAccessToken(): Promise<CreateAdminAccessTokenRes> {
    return this.apiConventionsAppService.createAdminAccessToken();
  }

  /**
   * 6 allErroryTypes.
   *
   * @tag api-conventions
   */
  @TypedRoute.Get('all-error-types')
  allErroryTypes(): AllErrorTypes {
    return typia.random<AllErrorTypes>();
  }
}
