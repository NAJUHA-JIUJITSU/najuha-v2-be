import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { ResponseForm, createResponseForm } from '../common/response';
import { NOT_FOUND_USER } from '../common/error';
import { SetAuthLevel, AuthLevel } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 2-1 create user. // TODO: api 삭제 예정(유저 생성은 내부적으로만 사용))
   *
   * @tag 2 user
   * @returns created user info
   */
  @SetAuthLevel(AuthLevel.USER)
  @TypedRoute.Post()
  async postUser(
    @TypedBody() dto: CreateUserDto,
  ): Promise<ResponseForm<UserEntity>> {
    return createResponseForm(await this.usersService.createUser(dto));
  }

  /**
   * 2-2 update user.
   *
   * @tag 2 user
   * @param dto UpdateUserDto
   * @returns updated user
   */
  @SetAuthLevel(AuthLevel.USER)
  @TypedRoute.Patch('/:userId')
  async patchUser(
    @TypedParam('userId') userId: UserEntity['id'],
    @TypedBody() dto: UpdateUserDto,
  ): Promise<ResponseForm<UserEntity> | NOT_FOUND_USER> {
    return createResponseForm(await this.usersService.updateUser(userId, dto));
  }

  /**
   * 2-3 find user.
   *
   * @tag 2 user
   * @param userId userId
   * @returns user data
   */
  @SetAuthLevel(AuthLevel.USER)
  @TypedRoute.Get('/:userId')
  async getUser(
    @TypedParam('userId') userId: UserEntity['id'],
  ): Promise<ResponseForm<UserEntity | null>> {
    return createResponseForm(await this.usersService.findUserById(userId));
  }
}
