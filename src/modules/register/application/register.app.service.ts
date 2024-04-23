import { Injectable } from '@nestjs/common';
import { BusinessException, RegisterErrorMap } from 'src/common/response/errorResponse';
import { AuthTokenDomainService } from 'src/modules/auth/domain/auth-token.domain.service';
import { PhoneNumberAuthCodeDomainService } from '../domain/phone-number-auth-code.domain.service';
import { RegisterRepository } from '../register.repository';
import { RegisterUserEntityFactory } from '../domain/register-user.factory';
import {
  ConfirmAuthCodeParam,
  ConfirmAuthCodeRet,
  GetTemporaryUserParam,
  GetTemporaryUserRet,
  IsDuplicateNicknameParam,
  IsDuplicateNicknameRet,
  RegisterUserParam,
  RegisterUserRet,
  SendPhoneNumberAuthCodeParam,
  SendPhoneNumberAuthCodeRet,
} from './dtos';
import { RegisterUserModel } from '../domain/model/register-user.model';

@Injectable()
export class RegisterAppService {
  constructor(
    private readonly authTokenDomainService: AuthTokenDomainService,
    private readonly phoneAuthCodeProvider: PhoneNumberAuthCodeDomainService,
    private readonly registerRepository: RegisterRepository,
    private readonly regiterUserEntityFactory: RegisterUserEntityFactory,
  ) {}

  async getTemporaryUser({ userId }: GetTemporaryUserParam): Promise<GetTemporaryUserRet> {
    const user = await this.registerRepository.getTemporaryUser(userId);
    return { user };
  }

  /**
   * 닉네임 중복 체크
   * - 존재하지 않는 닉네임이면 false를 반존
   * - 존재하는 닉네임 이지만 본인이 사용중이면 false를 반환
   * - 존재하는 닉네임이면 true를 반환
   */
  async isDuplicateNickname({ userId, nickname }: IsDuplicateNicknameParam): Promise<IsDuplicateNicknameRet> {
    // domain service로 분리 ?
    const user = await this.registerRepository.findUser({ where: { nickname } });
    if (user === null) return { isDuplicated: false };
    if (user.id === userId) return { isDuplicated: false };
    return { isDuplicated: true };
  }

  // TODO: smsService 개발후 PhoneNumberAuthCode대신 null 반환으로 변환
  async sendPhoneNumberAuthCode({
    userId,
    phoneNumber,
  }: SendPhoneNumberAuthCodeParam): Promise<SendPhoneNumberAuthCodeRet> {
    const phoneNumberAuthCode = await this.phoneAuthCodeProvider.issueAuthCode(userId, phoneNumber);
    // TODO: 인증코드를 전송 await this.smsService.sendAuthCode(phoneNumber, authCode);
    return { phoneNumberAuthCode };
  }

  async confirmAuthCode({ userId, authCode }: ConfirmAuthCodeParam): Promise<ConfirmAuthCodeRet> {
    const isConfirmed = await this.phoneAuthCodeProvider.isAuthCodeValid(userId, authCode);
    return { isConfirmed };
  }

  async registerUser({ userRegisterDto, consentPolicyTypes }: RegisterUserParam): Promise<RegisterUserRet> {
    const { isDuplicated } = await this.isDuplicateNickname({
      userId: userRegisterDto.id,
      nickname: userRegisterDto.nickname,
    });
    if (isDuplicated) throw new BusinessException(RegisterErrorMap.REGISTER_NICKNAME_DUPLICATED);
    let registerUserEntity = await this.registerRepository.getRegisterUser(userRegisterDto.id);
    const latestPolicies = await this.registerRepository.findAllTypesOfLatestPolicies();
    const mandatoryPolicies = await this.registerRepository.findAllMandatoryPolicies();

    registerUserEntity = await this.regiterUserEntityFactory.createRegisterUser(
      registerUserEntity,
      latestPolicies,
      consentPolicyTypes,
    );

    const registerUserModel = new RegisterUserModel(registerUserEntity);
    registerUserModel.ensurePhoneNumberRegistered();
    registerUserModel.ensureMandatoryPoliciesConsented(mandatoryPolicies);

    await this.registerRepository.saveUser(registerUserModel.toEntity());

    const authTokens = await this.authTokenDomainService.createAuthTokens(
      registerUserModel.getId(),
      registerUserModel.getRole(),
    );
    return { authTokens };
  }
}
