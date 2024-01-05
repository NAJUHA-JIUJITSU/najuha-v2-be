import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

export interface ResponseForm<T> {
  result: true;
  code: 1000;
  data: T;
}

function createResponseForm<T>(data: T): ResponseForm<T> {
  return {
    result: true,
    code: 1000,
    data,
  };
}

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
  patchUser(@TypedBody() dto: UpdateUserDto): UpdateUserDto {
    return dto;
  }

  /**
   * 1-3 get user.
   *
   * @tag 1 user
   * @param userId user id
   * @returns updated user
   */
  @TypedRoute.Get('/:userId')
  async getUser(
    @TypedParam('userId') userId: number,
  ): Promise<ResponseForm<UserEntity | null>> {
    console.log(userId);
    const res = await this.usersService.findUserById(userId);
    return createResponseForm(res);
  }
}
