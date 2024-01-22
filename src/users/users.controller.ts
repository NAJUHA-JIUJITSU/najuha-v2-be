import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { ResponseForm, createResponseForm } from '../common/response/response';
import { SetGuardLevel, GuardLevel } from '../auth/auth.guard';
import { USERS_NOT_FOUND_ERROR } from './users.error';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 2-1 create user. // TODO: api 삭제 예정(유저 생성은 내부적으로만 사용))
   *
   * @tag 2 users
   * @returns created user info
   */
  @SetGuardLevel(GuardLevel.USER)
  @TypedRoute.Post()
  async postUser(
    @TypedBody() dto: CreateUserDto,
  ): Promise<ResponseForm<UserEntity>> {
    return createResponseForm(await this.usersService.createUser(dto));
  }

  /**
   * 2-2 update user.
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
  ): Promise<ResponseForm<UserEntity> | USERS_NOT_FOUND_ERROR> {
    return createResponseForm(await this.usersService.updateUser(userId, dto));
  }

  /**
   * 2-3 get me.
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
