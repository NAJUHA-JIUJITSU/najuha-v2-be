import { TypedBody, TypedException, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import {
  AUTH_ACCESS_TOKEN_MISSING,
  AUTH_ACCESS_TOKEN_UNAUTHORIZED,
  AUTH_LEVEL_FORBIDDEN,
} from 'src/common/response/errorResponse';

/**
 * 여기는 실제 controller 가 아니라 api conventions 에 대한 설명을 위한 코드입니다.
 */
@Controller('api-conventions')
export class ApiConventionsController {
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
  @TypedException<AUTH_ACCESS_TOKEN_MISSING>(4000, 'AUTH_ACCESS_TOKEN_MISSING')
  @TypedException<AUTH_ACCESS_TOKEN_UNAUTHORIZED>(4001, 'AUTH_ACCESS_TOKEN_UNAUTHORIZED')
  @TypedException<AUTH_LEVEL_FORBIDDEN>(4003, 'AUTH_LEVEL_FORBIDDEN')
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
}
