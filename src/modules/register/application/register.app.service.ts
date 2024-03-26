import { Injectable } from '@nestjs/common';
import { RegisterReqDto } from '../structure/dto/request/register.req.dto';
import { BusinessException, RegisterErrorMap } from 'src/common/response/errorResponse';
import { AuthTokenDomainService } from 'src/modules/auth/domain/auth-token.domain.service';
import { PhoneNumberAuthCodeDomainService } from '../domain/phone-number-auth-code.domain.service';
import { RegisterPhoneNumberReqDto } from '../structure/dto/request/register-phone-number.req..dto';
import { RegisterUser } from '../domain/registerUser.entity';
import { confirmAuthCodeReqDto } from '../structure/dto/request/confirm-auth-code.req.dto';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { RegisterRepository } from '../register.repository';
import { PhoneNumberAuthCode } from '../structure/types/phone-number-auth-code.type';
import { IAuthTokens } from 'src/modules/auth/structure/auth-tokens.interface';

@Injectable()
export class RegisterAppService {
  constructor(
    private readonly AuthTokenDomainService: AuthTokenDomainService,
    private readonly phoneAuthCodeProvider: PhoneNumberAuthCodeDomainService,
    private readonly registerRepository: RegisterRepository,
  ) {}

  async getTemporaryUser(userId: User['id']): Promise<User> {
    return await this.registerRepository.getUser({ where: { id: userId } });
  }

  /**
   * 닉네임 중복 체크
   * - 존재하지 않는 닉네임이면 false를 반존
   * - 존재하는 닉네임 이지만 본인이 사용중이면 false를 반환
   * - 존재하는 닉네임이면 true를 반환
   */
  async isDuplicateNickname(userId: User['id'], nickname: string): Promise<boolean> {
    // domain service로 분리 ?
    const user = await this.registerRepository.findUser({ where: { nickname } });
    if (user === null) return false;
    if (user.id === userId) return false;
    return true;
  }

  // TODO: transaction 필요
  async registerUser(userId: User['id'], dto: RegisterReqDto): Promise<IAuthTokens> {
    if (await this.isDuplicateNickname(userId, dto.user.nickname)) {
      throw new BusinessException(RegisterErrorMap.REGISTER_NICKNAME_DUPLICATED);
    }

    const { policyConsents, ...user } = await this.registerRepository.getUser({
      where: { id: userId },
      relations: ['policyConsents'],
    });
    const latestPolicies = await this.registerRepository.findAllTypesOfLatestPolicies();
    const registerUser = new RegisterUser(user, policyConsents, dto.user, dto.consentPolicyTypes, latestPolicies);
    registerUser.validate();

    await this.registerRepository.updateUser(registerUser.user);
    await this.registerRepository.createPolicyConsents(registerUser.newPolicyConsents);
    return await this.AuthTokenDomainService.createAuthTokens(registerUser.user.id, registerUser.user.role);
  }

  // TODO: smsService 개발후 PhoneNumberAuthCode대신 null 반환으로 변환
  async sendPhoneNumberAuthCode(userId: User['id'], dto: RegisterPhoneNumberReqDto): Promise<PhoneNumberAuthCode> {
    const authCode = await this.phoneAuthCodeProvider.issueAuthCode(userId, dto.phoneNumber);
    // TODO: 인증코드를 전송 await this.smsService.sendAuthCode(phoneNumber, authCode);
    return authCode;
  }

  async confirmAuthCode(userId: User['id'], dto: confirmAuthCodeReqDto): Promise<boolean> {
    const isConfirmed = await this.phoneAuthCodeProvider.isAuthCodeValid(userId, dto.authCode);
    return isConfirmed;
  }
}
