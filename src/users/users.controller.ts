import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { SetGuardLevel, GuardLevel } from 'src/auth/auth.guard';
import { USERS_NOT_FOUND } from 'src/common/response/errorResponse';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 2-1 create user. // TODO: api 삭제 예정(유저 생성은 내부적으로만 사용))
   * - GuardLevel: USER
   *
   * @tag 2 users
   * @returns created user info
   */
  @SetGuardLevel(GuardLevel.USER)
  @TypedRoute.Post()
  async postUser(@TypedBody() dto: CreateUserDto): Promise<ResponseForm<UserEntity>> {
    return createResponseForm(await this.usersService.createUser(dto));
  }

  /**
   * 2-2 update user.
   * - GuardLevel: USER
   *
   * @tag 2 users
   * @param dto UpdateUserDto
   * @returns updated user
   */
  @SetGuardLevel(GuardLevel.TEMPORARY_USER) //TODO: USER 로 변경
  @TypedRoute.Patch('/:userId')
  async patchUser(
    @TypedParam('userId') userId: UserEntity['id'],
    @TypedBody() dto: UpdateUserDto,
  ): Promise<ResponseForm<UserEntity>> {
    return createResponseForm(await this.usersService.updateUser(userId, dto));
  }

  /**
   * 2-3 get me.
   * - GuardLevel: USER
   *
   * @tag 2 users
   * @returns me
   */
  @SetGuardLevel(GuardLevel.TEMPORARY_USER) // TODO: USER 로 변경
  @TypedRoute.Get('/me')
  async getMe(@Req() req: Request): Promise<ResponseForm<UserEntity | null>> {
    const userId = req['userId'];
    return createResponseForm(await this.usersService.findUserById(userId));
  }
}
