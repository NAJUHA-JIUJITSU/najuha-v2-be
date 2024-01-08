import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { ResponseForm, createResponseForm } from '../common/response';
import {
  EXIST_USER,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND_USER,
} from '../common/error';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 1-1 create user.
   *
   * @tag 1 user
   * @returns created user info
   */
  @TypedRoute.Post()
  postUser(@TypedBody() dto: CreateUserDto): Promise<CreateUserDto> {
    return this.usersService.createUser(dto);
  }

  /**
   * 1-2 update user.
   *
   * @tag 1 user
   * @param dto UpdateUserDto
   * @returns updated user
   */
  @TypedRoute.Patch()
  patchUser(@TypedBody() dto: UpdateUserDto): any {
    console.log('--------------------------', dto);
    return this.usersService.updateUser(dto);
  }

  /**
   * 1-3 get user.
   *
   * @tag 1 user
   * @param userId user id
   * @returns user info
   */
  @TypedRoute.Get('/:userId')
  async getUser(
    @TypedParam('userId') userId: number,
  ): Promise<
    | ResponseForm<UserEntity>
    | NOT_FOUND_USER
    | EXIST_USER
    | INTERNAL_SERVER_ERROR
  > {
    return createResponseForm(await this.usersService.findUserById(userId));
  }
}
