import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { BusinessException, RegisterErrorMap } from 'src/common/response/errorResponse';
import { AuthTokensDto } from 'src/auth/dto/auth-tokens.dto';
import { AuthService } from 'src/auth/auth.service';
import { PolicyEntity } from 'src/policy/entities/policy.entity';
import { PolicyService } from 'src/policy/policy.service';
import { users } from 'src/api/functional/user';
import { TemporaryUserDto } from 'src/users/dto/temporary-user.dto';

@Injectable()
export class RegisterService {
  constructor(
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
  async checkDuplicateNickname(userId: UserEntity['id'], nickname: string): Promise<boolean> {
    const user = await this.usersService.findUserByNickname(nickname);
    if (user === null) return false;
    if (user.id === userId) return false;
    return true;
  }

  async registerUser(userId: UserEntity['id'], dto: RegisterDto): Promise<AuthTokensDto> {
    if (dto.user.nickname && (await this.checkDuplicateNickname(userId, dto.user.nickname))) {
      throw new BusinessException(RegisterErrorMap.REGISTER_NICKNAME_DUPLICATED);
    }

    // check mandatory policy consent
    const recentPolicies = await this.policyService.findAllTypesOfRecentPolicies();
    const mandatoryPolicies = recentPolicies.filter((policy) => policy.isMandatory);
    this.validatePolicyConsent(dto.consentPolicyTypes, mandatoryPolicies);

    const user = await this.usersService.getUserById(userId);
    // check phone number is verified

    // if (dto.user.phoneNumber && !user.phoneNumberVerified) {
    //   throw new BusinessException(RegisterErrorMap.REGISTER_PHONE_NUMBER_NOT_VERIFIED);
    // }

    await this.usersService.updateUser(userId, { ...dto.user, role: 'USER' });

    return await this.authService.createAuthTokens(user.id, 'USER');
  }

  private validatePolicyConsent(types: PolicyEntity['type'][], mandatoryPolicies: PolicyEntity[]): void {
    mandatoryPolicies.forEach((policy) => {
      if (!types.includes(policy.type)) {
        throw new BusinessException(RegisterErrorMap.REGISTER_POLICY_CONSENT_REQUIRED);
      }
    });
  }
}
