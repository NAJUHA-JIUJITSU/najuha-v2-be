import { TypedBody, TypedException, TypedParam, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/common/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { UserEntity } from 'src/users/entities/user.entity';
import { RegisterService } from './register.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { AuthTokensDto } from 'src/auth/dto/auth-tokens.dto';
import { UsersService } from 'src/users/users.service';
import { REGISTER_NICKNAME_DUPLICATED, USERS_USER_NOT_FOUND } from 'src/common/response/errorResponse';

@Controller('user/register')
export class UserRegisterController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * u-2-1 get temporary user.
   * - RoleLevel: TEMPORARY_USER
   *
   * @tag u-2 register
   * @returns user
   */
  @TypedException<USERS_USER_NOT_FOUND>(4001, 'USERS_USER_NOT_FOUND')
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Get('users/me')
  async getTemporaryUser(@Req() req: Request): Promise<ResponseForm<UserEntity>> {
    const userId = req['userId'];
    const user = await this.usersService.getUserById(userId);
    return createResponseForm(user);
  }

  /**
   * u-2-2 check duplicated nickname.
   * - RoleLevel: TEMPORARY_USER
   * - 닉네임이 중복되면 true, 중복되지 않으면 false를 반환
   * - 본인이 사용중인 닉네임이면 false를 반환
   * - 이미 사용중인 닉네임이면 true를 반환
   *
   * @tag u-2 register
   * @returns user
   */
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Get('users/:nickname/is-duplicated')
  async checkDuplicateNickname(
    @Req() req: Request,
    @TypedParam('nickname') nickname: string,
  ): Promise<ResponseForm<boolean>> {
    const userId = req['userId'];
    const isDuplicated = await this.registerService.checkDuplicateNickname(userId, nickname);
    return createResponseForm(isDuplicated);
  }

  /**
   * u-2-3 register user.
   * - RoleLevel: TEMPORARY_USER
   * - 유저 정보를 업데이트하고, USER 레벨로 업데이트한다.
   * - USER 레벨로 업데이트된 accessToken, refreshToken을 반환한다.
   *
   * @tag u-2 register
   * @returns accessToken & refreshToken
   */
  @TypedException<REGISTER_NICKNAME_DUPLICATED>(3000, 'REGISTER_NICKNAME_DUPLICATED')
  @TypedException<USERS_USER_NOT_FOUND>(4001, 'USERS_USER_NOT_FOUND')
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Patch()
  async registerUser(@Req() req: Request, @TypedBody() dto: RegisterUserDto): Promise<ResponseForm<AuthTokensDto>> {
    const userId = req['userId'];
    const authTokens = await this.registerService.registerUser(userId, dto);
    return createResponseForm(authTokens);
  }

  // /**
  //  * u-2-4 update temporary user policy consent.
  //  * - RoleLevel: TEMPORARY_USER
  //  *
  //  * @tag u-2 register
  //  * @returns updated user
  //  */
  //   @RoleLevels(RoleLevel.TEMPORARY_USER)
  //   @TypedRoute.Patch('policy-consent')
  //   async patchTemporaryUserPolicyConsent(
  //     @Req() req: Request,
  //     @TypedBody() dto: UpdateTemporaryUserDto,
  //   ): Promise<ResponseForm<UserEntity>> {
  //     const userId = req['userId'];
  //     const user = await this.registerService.updateUser(userId, dto);
  //     return createResponseForm(user);
  //   }
}
