import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

export interface ResponseForm<T> {
  result: boolean;
  code: number;
  data: T;
}

export interface ERROR {
  result: false;
  code: number;
  data: string;
}

export interface NOT_FOUND_USER extends ERROR {
  result: false;
  code: 4001;
  data: '존재하지 않는 유저입니다.';
}

export interface EXIST_USER extends ERROR {
  result: false;
  code: 4002;
  data: '이미 존재하는 유저입니다.';
}

export class UserNotFoundException extends HttpException {
  constructor() {
    super('user not found', HttpStatus.NOT_FOUND);
  }
}

export function createResponseForm<T>(data: T): ResponseForm<T> {
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
   * @returns user info
   * @throws NOT_FOUND_USER
   */
  @TypedRoute.Get('/:userId')
  async getUser(
    @TypedParam('userId') userId: number,
  ): Promise<NOT_FOUND_USER | ResponseForm<UserEntity>> {
    return createResponseForm(await this.usersService.findUserById(userId));
  }
}
