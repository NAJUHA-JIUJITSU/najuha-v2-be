import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { BusinessException, RegisterErrorMap } from 'src/common/response/errorResponse';
import { AuthTokensDto } from 'src/auth/dto/auth-tokens.dto';
import { AuthService } from 'src/auth/auth.service';
import { PolicyService } from 'src/policy/policy.service';
import { TemporaryUserDto } from 'src/users/dto/temporary-user.dto';
import { RegisterPhoneNumberDto } from './dto/register-phone-number.dto';
import { Redis } from 'ioredis';
import typia from 'typia';
import { PhoneNumberAuthCode } from './types/phone-number-auth-code.type';

@Injectable()
export class RegisterService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly policyService: PolicyService,
  ) {}

  async getTemporaryUser(userId: UserEntity['id']): Promise<TemporaryUserDto> {
    return await this.usersService.getUserById(userId);
  }

  /**
   * 닉네임 중복 체크
   * - 존재하지 않는 닉네임이면 false를 반존
   * - 존재하는 닉네임 이지만 본인이 사용중이면 false를 반환
   * - 존재하는 닉네임이면 true를 반환
   */
  async isDuplicateNickname(userId: UserEntity['id'], nickname: string): Promise<boolean> {
    const user = await this.usersService.findUserByNickname(nickname);
    if (user === null) return false;
    if (user.id === userId) return false;
    return true;
  }

  async registerUser(userId: UserEntity['id'], dto: RegisterDto): Promise<AuthTokensDto> {
    if (await this.isDuplicateNickname(userId, dto.user.nickname)) {
      throw new BusinessException(RegisterErrorMap.REGISTER_NICKNAME_DUPLICATED);
    }

    // check mandatory policy consent
    const recentPolicies = await this.policyService.findAllTypesOfRecentPolicies();
    const mandatoryPolicies = recentPolicies.filter((policy) => policy.isMandatory);
    mandatoryPolicies.forEach((policy) => {
      if (!dto.consentPolicyTypes.includes(policy.type)) {
        throw new BusinessException(RegisterErrorMap.REGISTER_POLICY_CONSENT_REQUIRED);
      }
    });

    // check phone number
    const user = await this.usersService.getUserById(userId);
    if (!user.phoneNumber) {
      throw new BusinessException(RegisterErrorMap.REGISTER_PHONE_NUMBER_REQUIRED);
    }

    await this.usersService.updateUser(userId, { ...dto.user, role: 'USER' });
    return await this.authService.createAuthTokens(user.id, 'USER');
  }

  async sendPhoneNumberAuthCode(userId: UserEntity['id'], dto: RegisterPhoneNumberDto): Promise<PhoneNumberAuthCode> {
    // TODO: smsService 개발후 PhoneNumberAuthCode대신 null 반환으로 변환
    const phoneNumber = dto.phoneNumber;
    // 인증 코드 생성 6자리
    const authCode = typia.random<PhoneNumberAuthCode>();

    // 레디스에 인증코드 저장 (5분)
    this.redisClient.set(`userId:${userId}-authCode:${authCode}`, phoneNumber, 'EX', 300);

    // TODO: 인증코드를 전송
    // await this.smsService.sendAuthCode(phoneNumber, authCode);
    return authCode;
  }

  async confirmAuthCode(userId: UserEntity['id'], authCode: PhoneNumberAuthCode): Promise<boolean> {
    const phoneNumber = await this.redisClient.get(`userId:${userId}-authCode:${authCode}`);
    if (!phoneNumber) return false;

    await this.usersService.updateUser(userId, { phoneNumber });
    return true;
  }
}
