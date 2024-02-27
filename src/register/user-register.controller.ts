import { TypedBody, TypedException, TypedParam, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/common/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { RegisterService } from './register.service';
import { RegisterDto } from './dto/register.dto';
import { REGISTER_NICKNAME_DUPLICATED, USERS_USER_NOT_FOUND } from 'src/common/response/errorResponse';
import { TemporaryUserDto } from 'src/users/dto/temporary-user.dto';
import { AuthTokensDto } from 'src/auth/dto/auth-tokens.dto';
import { RegisterPhoneNumberDto } from './dto/register-phone-number.dto';
import { PhoneNumberAuthCode } from './types/phone-number-auth-code.type';

@Controller('user/register')
export class UserRegisterController {
  constructor(private readonly registerService: RegisterService) {}

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
  async getTemporaryUser(@Req() req: Request): Promise<ResponseForm<TemporaryUserDto>> {
    const userId = req['userId'];
    const user = await this.registerService.getTemporaryUser(userId);
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
   * @param nickname 닉네임
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
   * u-2-3 send auth code to phone number.
   * - RoleLevel: TEMPORARY_USER
   * - 전화번호로 인증코드를 전송한다.
   *
   * @tag u-2 register
   * @returns void
   */
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Post('phone-number/auth-code')
  async sendPhoneNumberAuthCode(
    @Req() req: Request,
    @TypedBody() dto: RegisterPhoneNumberDto,
  ): Promise<ResponseForm<null | string>> {
    // TODO: smsService 개발후 null 반환으로 변환
    const userId = req['userId'];
    const authCode = await this.registerService.sendPhoneNumberAuthCode(userId, dto);
    return createResponseForm(authCode);
  }

  // 전화번호 인증코드 확화
  /**
   * u-2-4 confirm auth code.
   * - RoleLevel: TEMPORARY_USER
   * - 전화번호로 전송된 인증코드를 확인한다.
   * - 인증성공시 UserEntity의 phoneNumber를 업데이트한다.
   * - 인증성공시 true, 실패시 false를 반환한다.
   *
   * @tag u-2 register
   * @param authCode 인증코드
   * @returns true or false
   */
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Post('phone-number/auth-code/:authCode/confirm')
  async confirmAuthCode(
    @Req() req: Request,
    @TypedParam('authCode') authCode: PhoneNumberAuthCode,
  ): Promise<ResponseForm<boolean>> {
    const userId = req['userId'];
    const isConfirmed = await this.registerService.confirmAuthCode(userId, authCode);
    return createResponseForm(isConfirmed);
  }

  /**
   * u-2-5 register user.
   * - RoleLevel: TEMPORARY_USER
   * - 유저 정보를 업데이트하고, USER 레벨로 업데이트한다.
   * - USER 레벨로 업데이트된 accessToken, refreshToken을 반환한다.
   *
   * @tag u-2 register
   * @param dto RegisterDto
   * @returns accessToken & refreshToken
   */
  @TypedException<REGISTER_NICKNAME_DUPLICATED>(3000, 'REGISTER_NICKNAME_DUPLICATED')
  @TypedException<USERS_USER_NOT_FOUND>(4001, 'USERS_USER_NOT_FOUND')
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Patch()
  async registerUser(@Req() req: Request, @TypedBody() dto: RegisterDto): Promise<ResponseForm<AuthTokensDto>> {
    const userId = req['userId'];
    const authTokens = await this.registerService.registerUser(userId, dto);
    return createResponseForm(authTokens);
  }
}
