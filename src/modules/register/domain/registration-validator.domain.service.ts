import { Injectable } from '@nestjs/common';
import { TemporaryUserRepository } from '../../../database/custom-repository/temporary-user.repository';
import { UserRepository } from '../../../database/custom-repository/user.repository';
import { IsDuplicateNicknameParam } from '../application/register.app.dto';
import { TemporaryUserModel } from '../../users/domain/model/temporary-user.model';
import { PolicyModel } from '../../policy/domain/model/policy.model';

@Injectable()
export class RegistrationValidatorDomainService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly temporaryUserRepository: TemporaryUserRepository,
  ) {}

  async isDuplicateNickname({ userId, nickname }: IsDuplicateNicknameParam): Promise<boolean> {
    const [user, temporaryUser] = await Promise.all([
      this.userRepository.findOne({ where: { nickname } }),
      this.temporaryUserRepository.findOne({ where: { nickname } }),
    ]);

    if (!user && !temporaryUser) return false;
    if (user && user.id === userId) return false;
    if (temporaryUser && temporaryUser.id === userId) return false;
    return true;
  }

  validateRegistration(temporaryUser: TemporaryUserModel, latastPolicies: PolicyModel[]): void {
    temporaryUser.ensurePhoneNumberRegistered();
    temporaryUser.ensureMandatoryPoliciesConsented(latastPolicies.filter((policy) => policy.getIsMandatory()));
  }
}
