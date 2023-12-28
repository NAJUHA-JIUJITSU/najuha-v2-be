import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 1-1 create user.
   *
   * @tag 1 user
   * @returns created user info
   */
  @TypedRoute.Post()
  postUser(@TypedBody() dto: CreateUserDto): Promise<CreateUserDto> {
    return this.userService.createUser(dto);
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
}
