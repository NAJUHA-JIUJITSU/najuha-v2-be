import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../presentation/dto/register.dto';
import { BusinessException, RegisterErrorMap } from 'src/common/response/errorResponse';
import { AuthTokensDto } from 'src/modules/auth/presentation/dto/auth-tokens.dto';
import { UsersRepository } from 'src/infrastructure/database/repositories/users.repository';
import { PolicyRepository } from 'src/infrastructure/database/repositories/policy.repository';
import { AuthTokenDomainService } from 'src/modules/auth/domain/auth-token.domain.service';
import { PhoneNumberAuthCodeDomainService } from '../domain/phone-number-auth-code.domain.service';
import { PolicyConsentRepository } from 'src/infrastructure/database/repositories/policy-consent.repository';
import { RegisterPhoneNumberDto } from '../presentation/dto/register-phone-number.dto';
import { PhoneNumberAuthCode } from '../presentation/dto/phone-number-auth-code.type';
import { RegisterUser } from '../domain/registerUser.entity';
import { PhoneNumberAuthCodeDto } from '../presentation/dto/phone-number-auth-code.dto';
import { ITemporaryUser } from 'src/interfaces/temporary-user.interface';
import { IUser } from 'src/interfaces/user.interface';

@Injectable()
export class RegisterAppService {
  constructor(
    private readonly AuthTokenDomainService: AuthTokenDomainService,
    private readonly phoneAuthCodeProvider: PhoneNumberAuthCodeDomainService,
    private readonly usersRepository: UsersRepository,
    private readonly policyRepository: PolicyRepository,
    private readonly policyConsetRepository: PolicyConsentRepository,
  ) {}

  async getTemporaryUser(userId: IUser['id']): Promise<ITemporaryUser> {
    return await this.usersRepository.getTemporaryUserOrFail(userId);
  }

  /**
   * 닉네임 중복 체크
   * - 존재하지 않는 닉네임이면 false를 반존
   * - 존재하는 닉네임 이지만 본인이 사용중이면 false를 반환
   * - 존재하는 닉네임이면 true를 반환
   */
  async isDuplicateNickname(userId: IUser['id'], nickname: string): Promise<boolean> {
    const user = await this.usersRepository.findOneBy({ nickname });
    if (user === null) return false;
    if (user.id === userId) return false;
    return true;
  }

  // TODO: transaction 필요
  async registerUser(userId: IUser['id'], dto: RegisterDto): Promise<AuthTokensDto> {
    if (await this.isDuplicateNickname(userId, dto.user.nickname)) {
      throw new BusinessException(RegisterErrorMap.REGISTER_NICKNAME_DUPLICATED);
    }

    const user = await this.usersRepository.getOneOrFail({ where: { id: userId }, relations: ['policyConsents'] });
    const latestPolicies = await this.policyRepository.findAllTypesOfLatestPolicies();
    const registerUser = new RegisterUser(user, dto.user, dto.consentPolicyTypes, latestPolicies);
    registerUser.validate();

    await this.usersRepository.save(registerUser.user);
    await this.policyConsetRepository.save(registerUser.user.policyConsents);
    return await this.AuthTokenDomainService.createAuthTokens(registerUser.user.id, registerUser.user.role);
  }

  // TODO: smsService 개발후 PhoneNumberAuthCode대신 null 반환으로 변환
  async sendPhoneNumberAuthCode(userId: IUser['id'], dto: RegisterPhoneNumberDto): Promise<PhoneNumberAuthCode> {
    const authCode = await this.phoneAuthCodeProvider.issueAuthCode(userId, dto.phoneNumber);
    // TODO: 인증코드를 전송 await this.smsService.sendAuthCode(phoneNumber, authCode);
    return authCode;
  }

  async confirmAuthCode(userId: IUser['id'], dto: PhoneNumberAuthCodeDto): Promise<boolean> {
    return await this.phoneAuthCodeProvider.isAuthCodeValid(userId, dto.authCode);
  }
}
