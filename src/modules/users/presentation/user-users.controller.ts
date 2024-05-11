import { TypedBody, TypedException, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { UsersAppService } from 'src/modules/users/application/users.app.service';
import { ENTITY_NOT_FOUND } from 'src/common/response/errorResponse';
import { CreateUserReqBody, CreateUserRes, GetMeRes, UpdateUserReqBody, UpdateUserRes } from './dtos';

@Controller('user/users')
export class UserUsersController {
  constructor(private readonly UsersAppService: UsersAppService) {}

  /**
   * u-3-1 create user. // todo!: api 삭제 예정(유저 생성은 내부적으로만 사용)).
   * - RoleLevel: USER.
   *
   * @tag u-3 users
   * @returns created user info
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('/')
  async postUser(@TypedBody() body: CreateUserReqBody): Promise<ResponseForm<CreateUserRes>> {
    return createResponseForm(await this.UsersAppService.createUser({ userCreateDto: body }));
  }

  /**
   * u-3-2 update user.
   * - RoleLevel: USER.
   *
   * @tag u-3 users
   * @param dto UpdateUserReqDto
   * @returns updated user
   */
  @TypedException<ENTITY_NOT_FOUND>(404, 'ENTITY_NOT_FOUND')
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Patch('/')
  async patchUser(@Req() req: Request, @TypedBody() body: UpdateUserReqBody): Promise<ResponseForm<UpdateUserRes>> {
    return createResponseForm(await this.UsersAppService.updateUser({ userUpdateDto: { ...body, id: req['userId'] } }));
  }

  /**
   * u-3-3 get me.
   * - RoleLevel: USER.
   *
   * @tag u-3 users
   * @returns user
   */
  @TypedException<ENTITY_NOT_FOUND>(404, 'ENTITY_NOT_FOUND')
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Get('/me')
  async getMe(@Req() req: Request): Promise<ResponseForm<GetMeRes>> {
    return createResponseForm(await this.UsersAppService.getMe({ userId: req['userId'] }));
  }
}
