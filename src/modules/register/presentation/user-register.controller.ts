import { TypedBody, TypedException, TypedParam, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { RegisterAppService } from '../application/register.app.service';
import {
  ENTITY_NOT_FOUND,
  REGISTER_NICKNAME_DUPLICATED,
  REGISTER_PHONE_NUMBER_REQUIRED,
  REGISTER_POLICY_CONSENT_REQUIRED,
} from 'src/common/response/errorResponse';
import {
  ConfirmAuthCodeReqBody,
  ConfirmAuthCodeRes,
  GetTemporaryUserRes,
  IsDuplicatedNicknameRes,
  RegisterUserReqBody,
  RegisterUserRes,
  SendPhoneNumberAuthCodeReqBody,
  SendPhoneNumberAuthCodeRes,
} from './register.controller.dto';
import { IUser } from 'src/modules/users/domain/interface/user.interface';

@Controller('user/register')
export class UserRegisterController {
  constructor(private readonly RegisterAppService: RegisterAppService) {}

  /**
   * u-2-1 getTemporaryUser.
   * - RoleLevel: TEMPORARY_USER.
   *
   * @tag u-2 register
   * @security bearer
   * @returns GetTemporaryUserRes
   */
  @TypedException<ENTITY_NOT_FOUND>(404, 'ENTITY_NOT_FOUND')
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Get('users/me')
  async getTemporaryUser(@Req() req: Request): Promise<ResponseForm<GetTemporaryUserRes>> {
    return createResponseForm(await this.RegisterAppService.getTemporaryUser({ userId: req['userId'] }));
  }

  /**
   * u-2-2 isDuplicateNickname.
   * - RoleLevel: TEMPORARY_USER.
   * - 닉네임이 중복되면 true, 중복되지 않으면 false를 반환.
   * - 본인이 사용중인 닉네임이면 false를 반환.
   * - 이미 사용중인 닉네임이면 true를 반환.
   *
   * @tag u-2 register
   * @security bearer
   * @param nickname 닉네임
   * @returns IsDuplicatedNicknameRes
   */
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Get('users/:nickname/is-duplicated')
  async isDuplicateNickname(
    @Req() req: Request,
    @TypedParam('nickname') nickname: IUser['nickname'],
  ): Promise<ResponseForm<IsDuplicatedNicknameRes>> {
    return createResponseForm(await this.RegisterAppService.isDuplicateNickname({ userId: req['userId'], nickname }));
  }

  /**
   * u-2-3 sendPhoneNumberAuthCode.
   * - RoleLevel: TEMPORARY_USER.
   * - 전화번호로 인증코드를 전송한다.
   *
   * @tag u-2 register
   * @security bearer
   * @param body SendPhoneNumberAuthCodeReqBody
   * @returns SendPhoneNumberAuthCodeRes
   */
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Post('phone-number/auth-code')
  async sendPhoneNumberAuthCode(
    @Req() req: Request,
    @TypedBody() body: SendPhoneNumberAuthCodeReqBody,
  ): Promise<ResponseForm<SendPhoneNumberAuthCodeRes>> {
    // todo!: smsService 개발후 PhoneNumberAuthCode대신 null 반환으로 변환
    return createResponseForm(
      await this.RegisterAppService.sendPhoneNumberAuthCode({
        userId: req['userId'],
        phoneNumber: body.phoneNumber,
      }),
    );
  }

  /**
   * u-2-4 confirmAuthCode.
   * - RoleLevel: TEMPORARY_USER.
   * - 전화번호로 전송된 인증코드를 확인한다.
   * - 인증성공시 User의 phoneNumber를 업데이트한다.
   * - 인증성공시 true, 실패시 false를 반환한다.
   *
   * @tag u-2 register
   * @security bearer
   * @param body ConfirmAuthCodeReqBody
   * @returns ConfirmAuthCodeRes
   */
  @TypedException<ENTITY_NOT_FOUND>(404, 'ENTITY_NOT_FOUND')
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Post('phone-number/auth-code/confirm')
  async confirmAuthCode(
    @Req() req: Request,
    @TypedBody() body: ConfirmAuthCodeReqBody,
  ): Promise<ResponseForm<ConfirmAuthCodeRes>> {
    return createResponseForm(
      await this.RegisterAppService.confirmAuthCode({
        userId: req['userId'],
        authCode: body.authCode,
      }),
    );
  }

  /**
   * u-2-5 registerUser.
   * - RoleLevel: TEMPORARY_USER.
   * - 유저 정보를 업데이트하고, USER 레벨로 업데이트한다.
   * - USER 레벨로 업데이트된 accessToken, refreshToken을 반환한다.
   *
   * @tag u-2 register
   * @security bearer
   * @param body RegisterUserReqBody
   * @returns RegisterUserRes
   */
  @TypedException<ENTITY_NOT_FOUND>(404, 'ENTITY_NOT_FOUND')
  @TypedException<REGISTER_NICKNAME_DUPLICATED>(3000, 'REGISTER_NICKNAME_DUPLICATED')
  @TypedException<REGISTER_POLICY_CONSENT_REQUIRED>(3002, 'REGISTER_POLICY_CONSENT_REQUIRED')
  @TypedException<REGISTER_PHONE_NUMBER_REQUIRED>(3003, 'REGISTER_PHONE_NUMBER_REQUIRED')
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Patch()
  async registerUser(
    @Req() req: Request,
    @TypedBody() body: RegisterUserReqBody,
  ): Promise<ResponseForm<RegisterUserRes>> {
    return createResponseForm(
      await this.RegisterAppService.registerUser({
        userRegisterDto: { id: req['userId'], ...body.user },
        consentPolicyTypes: body.consentPolicyTypes,
      }),
    );
  }
}
