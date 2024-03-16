import { TypedBody, TypedException, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { USERS_USER_NOT_FOUND } from 'src/common/response/errorResponse';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { CreateUserReqDto } from 'src/modules/users/dto/request/create-user.req.dto';
import { UpdateUserReqDto } from 'src/modules/users/dto/request/update-user.req.dto';
import { UsersAppService } from 'src/modules/users/application/users.app.service';
import { UserResDto } from '../dto/response/user.res.dto';

@Controller('user/users')
export class UserUsersController {
  constructor(private readonly UsersAppService: UsersAppService) {}

  /**
   * u-3-1 create user. // TODO: api 삭제 예정(유저 생성은 내부적으로만 사용)).
   * - RoleLevel: USER.
   *
   * @tag u-3 users
   * @returns created user info
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('/')
  async postUser(@TypedBody() dto: CreateUserReqDto): Promise<ResponseForm<UserResDto>> {
    const ret = await this.UsersAppService.createUser(dto);
    return createResponseForm(ret);
  }

  /**
   * u-3-2 update user.
   * - RoleLevel: USER.
   *
   * @tag u-3 users
   * @param dto UpdateUserReqDto
   * @returns updated user
   */
  @TypedException<USERS_USER_NOT_FOUND>(4001, 'USERS_USER_NOT_FOUND')
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Patch('/')
  async patchUser(@Req() req: Request, @TypedBody() dto: UpdateUserReqDto): Promise<ResponseForm<UserResDto>> {
    const ret = await this.UsersAppService.updateUser(req['userId'], dto);
    return createResponseForm(ret);
  }

  /**
   * u-3-3 get me.
   * - RoleLevel: USER.
   *
   * @tag u-3 users
   * @returns user
   */
  @TypedException<USERS_USER_NOT_FOUND>(4001, 'USERS_USER_NOT_FOUND')
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Get('/me')
  async getMe(@Req() req: Request): Promise<ResponseForm<UserResDto>> {
    const ret = await this.UsersAppService.getMe(req['userId']);
    return createResponseForm(ret);
  }
}
