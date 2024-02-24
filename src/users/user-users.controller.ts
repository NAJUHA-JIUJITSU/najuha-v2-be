import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { SetGuardLevel, GuardLevel } from 'src/auth/auth.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

// TODO: GaurdLevel 설설
@Controller('user/users')
export class UserUsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * u-3-1 create user. // TODO: api 삭제 예정(유저 생성은 내부적으로만 사용))
   * - GuardLevel: USER
   *
   * @tag u-3 users
   * @returns created user info
   */
  @SetGuardLevel(GuardLevel.USER)
  @TypedRoute.Post('/')
  async postUser(@TypedBody() dto: CreateUserDto): Promise<ResponseForm<UserEntity>> {
    const user = await this.usersService.createUser(dto);
    return createResponseForm(user);
  }

  /**
   * u-3-2 update user.
   * - GuardLevel: USER
   *
   * @tag u-3 users
   * @param dto UpdateUserDto
   * @returns updated user
   */
  @SetGuardLevel(GuardLevel.USER)
  @TypedRoute.Patch('/')
  async patchUser(@Req() req: Request, @TypedBody() dto: UpdateUserDto): Promise<ResponseForm<UserEntity>> {
    const userId = req['userId'];
    const user = await this.usersService.updateUser(userId, dto);
    return createResponseForm(user);
  }

  /**
   * u-3-3 get me.
   * - GuardLevel: USER
   *
   * @tag u-3 users
   * @returns user
   */
  @SetGuardLevel(GuardLevel.USER)
  @TypedRoute.Get('/me')
  async getMe(@Req() req: Request): Promise<ResponseForm<UserEntity | null>> {
    const userId = req['userId'];
    const user = await this.usersService.findUserById(userId);
    return createResponseForm(user);
  }
}
