import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { SetGuardLevel, GuardLevel } from 'src/auth/auth.guard';
import { USERS_NOT_FOUND } from 'src/common/response/errorResponse';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

// TODO: GaurdLevel 설설
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
  @TypedRoute.Post('/')
  async postUser(@TypedBody() dto: CreateUserDto): Promise<ResponseForm<UserEntity>> {
    const user = await this.usersService.createUser(dto);
    return createResponseForm(user);
  }

  /**
   * 2-2 update user.
   * - GuardLevel: USER
   *
   * @tag 2 users
   * @param dto UpdateUserDto
   * @returns updated user
   */
  @SetGuardLevel(GuardLevel.TEMPORARY_USER)
  @TypedRoute.Patch('/')
  async patchUser(@Req() req: Request, @TypedBody() dto: UpdateUserDto): Promise<ResponseForm<UserEntity>> {
    const userId = req['userId'];
    const user = await this.usersService.updateUser(userId, dto);
    return createResponseForm(user);
  }

  /**
   * 2-3 get me.
   * - GuardLevel: USER
   *
   * @tag 2 users
   * @returns me
   */
  @SetGuardLevel(GuardLevel.TEMPORARY_USER)
  @TypedRoute.Get('/me')
  async getMe(@Req() req: Request): Promise<ResponseForm<UserEntity | null>> {
    const userId = req['userId'];
    const user = await this.usersService.findUserById(userId);
    return createResponseForm(user);
  }

  /**
   * 2-4 get user by nickname.
   * - GuardLevel: USER
   *
   * @tag 2 users
   * @returns user
   */
  @SetGuardLevel(GuardLevel.TEMPORARY_USER)
  @TypedRoute.Get('/:nickname')
  async getUserByNickname(
    @TypedParam('nickname') nickname: string,
  ): Promise<ResponseForm<Pick<UserEntity, 'nickname'> | null>> {
    const user = await this.usersService.findUserByNickname(nickname);
    return createResponseForm(user);
  }
}
