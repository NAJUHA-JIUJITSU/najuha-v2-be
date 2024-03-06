import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { BusinessException, RegisterErrorMap } from 'src/common/response/errorResponse';
import { AuthTokensDto } from 'src/auth/dto/auth-tokens.dto';
import { TemporaryUserDto } from 'src/users/dto/temporary-user.dto';
import { UsersRepository } from 'src/users/users.repository';
import { PolicyRepository } from 'src/policy/policy.repository';
import { AuthTokenProvider } from 'src/auth/auth-token.provider';
import { PhoneNumberAuthCodeProvider } from './pooneNumberAuthCode.provider';
import { PolicyConsentRepository } from 'src/policy-consents/policy-consent.repository';
import { RegisterPhoneNumberDto } from './dto/register-phone-number.dto';
import { PhoneNumberAuthCode } from './types/phone-number-auth-code.type';
import { RegisterUserEntity } from './entities/registerUser.entity';
import { PolicyConsentEntity } from 'src/policy-consents/entity/policy-consent.entity';

@Injectable()
export class RegisterService {
  constructor(
    private readonly authTokenProvider: AuthTokenProvider,
    private readonly phoneAuthCodeProvider: PhoneNumberAuthCodeProvider,
    private readonly usersRepository: UsersRepository,
    private readonly policyRepository: PolicyRepository,
    private readonly policyConsetRepository: PolicyConsentRepository,
  ) {}

  async getTemporaryUser(userId: UserEntity['id']): Promise<TemporaryUserDto> {
    return await this.usersRepository.getOneOrFail({ id: userId });
  }

  /**
   * 닉네임 중복 체크
   * - 존재하지 않는 닉네임이면 false를 반존
   * - 존재하는 닉네임 이지만 본인이 사용중이면 false를 반환
   * - 존재하는 닉네임이면 true를 반환
   */
  async isDuplicateNickname(userId: UserEntity['id'], nickname: string): Promise<boolean> {
    const user = await this.usersRepository.findOneBy({ nickname });
    if (user === null) return false;
    if (user.id === userId) return false;
    return true;
  }

  // TODO: transaction 필요
  async registerUser(userId: UserEntity['id'], dto: RegisterDto): Promise<AuthTokensDto> {
    if (await this.isDuplicateNickname(userId, dto.user.nickname)) {
      throw new BusinessException(RegisterErrorMap.REGISTER_NICKNAME_DUPLICATED);
    }

    const user = await this.usersRepository.getOneOrFail({ id: userId });
    const latestPolicies = await this.policyRepository.findAllTypesOfLatestPolicies();
    const policyConsents = latestPolicies.reduce((acc, policy) => {
      if (dto.consentPolicyTypes.includes(policy.type)) {
        const consent = this.policyConsetRepository.create({ userId, policyId: policy.id });
        acc.push(consent);
      }
      return acc;
    }, [] as PolicyConsentEntity[]);
    const registerUser = new RegisterUserEntity(user, dto.user, policyConsents);

    registerUser.verifyPhoneNumberRegistered();

    const mandatoryPolicies = latestPolicies.filter((policy) => policy.isMandatory);
    registerUser.verifyMandatoryPolicyConsents(mandatoryPolicies);

    await this.usersRepository.updateOrFail(registerUser.user);
    await this.policyConsetRepository.save(registerUser.policyConsents);

    return await this.authTokenProvider.createAuthTokens(user.id, 'USER');
  }

  // async registerUser(userId: UserEntity['id'], dto: RegisterDto): Promise<AuthTokensDto> {
  //   if (await this.isDuplicateNickname(userId, dto.user.nickname)) {
  //     throw new BusinessException(RegisterErrorMap.REGISTER_NICKNAME_DUPLICATED);
  //   }

  //   const user = await this.usersRepository.saveOrFail({ id: userId, ...dto.user });

  //   user.verifyPhoneNumberRegistered();

  //   dto.consentPolicyTypes.forEach(async (consentPolicyType) => {
  //     const policy = await this.policyRepository.getOneLatestPolicyByTypeOrFail(consentPolicyType);
  //     const policyConsent = await this.policyConsetRepository.save({ userId, policyId: policy.id });
  //     user.setPolicyConsent(policyConsent);
  //   });

  //   const mandatoryPolicies = await this.policyRepository.findAllLatestMandatoryPolicies();
  //   user.verifyMandatoryPolicyConsents(mandatoryPolicies);

  //   return await this.authTokenProvider.createAuthTokens(user.id, 'USER');
  // }

  // async registerUser(userId: UserEntity['id'], dto: RegisterDto): Promise<AuthTokensDto> {
  //   if (await this.isDuplicateNickname(userId, dto.user.nickname)) {
  //     throw new BusinessException(RegisterErrorMap.REGISTER_NICKNAME_DUPLICATED);
  //   }

  //   // check mandatory policy consent
  //   const user = await this.usersRepository.getOneOrFail({ id: userId });
  //   const recentPolicies = await this.policyRepository.findAllTypesOfLatestPolicies();

  //   dto.consentPolicyTypes.forEach((consentPolicyType) => {
  //     if (!recentPolicies.some((policy) => policy.type === consentPolicyType)) {
  //       throw new BusinessException(RegisterErrorMap.REGISTER_POLICY_CONSENT_REQUIRED);
  //     }
  //   });

  //   // check phone number
  //   if (!user.phoneNumber) {
  //     throw new BusinessException(RegisterErrorMap.REGISTER_PHONE_NUMBER_REQUIRED);
  //   }

  //   await this.usersRepository.updateOrFail({ id: userId, ...dto.user });
  //   return await this.authTokenProvider.createAuthTokens(user.id, 'USER');
  // }

  // TODO: smsService 개발후 PhoneNumberAuthCode대신 null 반환으로 변환
  async sendPhoneNumberAuthCode(userId: UserEntity['id'], dto: RegisterPhoneNumberDto): Promise<PhoneNumberAuthCode> {
    const authCode = await this.phoneAuthCodeProvider.issueAuthCode(userId, dto.phoneNumber);
    // TODO: 인증코드를 전송 await this.smsService.sendAuthCode(phoneNumber, authCode);
    return authCode;
  }

  async confirmAuthCode(userId: UserEntity['id'], authCode: PhoneNumberAuthCode): Promise<boolean> {
    return await this.phoneAuthCodeProvider.isAuthCodeValid(userId, authCode);
  }
}
