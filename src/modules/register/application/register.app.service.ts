import { Injectable } from '@nestjs/common';
import { BusinessException, CommonErrors, RegisterErrors } from '../../../common/response/errorResponse';
import { AuthTokenDomainService } from '../../auth/domain/auth-token.domain.service';
import { PhoneNumberAuthCodeDomainService } from '../domain/phone-number-auth-code.domain.service';
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
} from './register.app.dto';
import { assert } from 'typia';
import { PolicyRepository } from '../../../database/custom-repository/policy.repository';
import { UserRepository } from '../../../database/custom-repository/user.repository';
import { PolicyConsentFactory } from '../domain/policy-consent.factory';
import { TemporaryUserModel } from '../../users/domain/model/temporary-user.model';
import { TemporaryUserRepository } from '../../../database/custom-repository/temporary-user.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class RegisterAppService {
  constructor(
    private readonly authTokenDomainService: AuthTokenDomainService,
    private readonly phoneAuthCodeProvider: PhoneNumberAuthCodeDomainService,
    private readonly policyConsentFactory: PolicyConsentFactory,
    private readonly userRepository: UserRepository,
    private readonly policyRepository: PolicyRepository,
    private readonly temporaryUserRepository: TemporaryUserRepository,
    private readonly dataSource: DataSource,
  ) {}

  async getTemporaryUser({ userId }: GetTemporaryUserParam): Promise<GetTemporaryUserRet> {
    const temporaryUserEntity = await this.temporaryUserRepository.findOneOrFail({ where: { id: userId } });
    if (!temporaryUserEntity) throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'TemporaryUser not found');
    return assert<GetTemporaryUserRet>({ user: temporaryUserEntity });
  }

  /**
   * 닉네임 중복 체크
   * - 존재하지 않는 닉네임이면 false를 반존
   * - 존재하는 닉네임 이지만 본인이 사용중이면 false를 반환
   * - 존재하는 닉네임이면 true를 반환
   */
  async isDuplicateNickname({ userId, nickname }: IsDuplicateNicknameParam): Promise<IsDuplicateNicknameRet> {
    const [user, temporaryUser] = await Promise.all([
      this.userRepository.findOne({ where: { nickname } }),
      this.temporaryUserRepository.findOne({ where: { nickname } }),
    ]);

    if (!user && !temporaryUser) return { isDuplicated: false };
    if (user && user.id === userId) return { isDuplicated: false };
    if (temporaryUser && temporaryUser.id === userId) return { isDuplicated: false };
    return { isDuplicated: true };
  }

  // todo!: smsService 개발후 PhoneNumberAuthCode대신 null 반환으로 변환
  async sendPhoneNumberAuthCode({
    userId,
    phoneNumber,
  }: SendPhoneNumberAuthCodeParam): Promise<SendPhoneNumberAuthCodeRet> {
    const phoneNumberAuthCode = await this.phoneAuthCodeProvider.issuePhoneNumberAuthCode(userId, phoneNumber);
    // todo!: 인증코드를 전송 await this.smsService.sendAuthCode(phoneNumber, authCode);
    return { phoneNumberAuthCode };
  }

  async confirmAuthCode({ userId, authCode }: ConfirmAuthCodeParam): Promise<ConfirmAuthCodeRet> {
    const phoneNumber = await this.phoneAuthCodeProvider.validatePhoneNumberAuthCodeValid(userId, authCode);
    if (!phoneNumber) return { isConfirmed: false };

    const temporaryUserData = await this.temporaryUserRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'TemporaryUser not found');
    });

    const temporaryUserModel = new TemporaryUserModel(temporaryUserData);
    temporaryUserModel.updataPhoneNumber(phoneNumber);
    await this.temporaryUserRepository.save(temporaryUserModel.toData());
    return { isConfirmed: true };
  }

  async registerUser(param: RegisterUserParam): Promise<RegisterUserRet> {
    const { isDuplicated } = await this.isDuplicateNickname({
      userId: param.userId,
      nickname: param.nickname,
    });
    if (isDuplicated) throw new BusinessException(RegisterErrors.REGISTER_NICKNAME_DUPLICATED);

    const temporaryUserData = await this.temporaryUserRepository
      .findOneOrFail({ where: { id: param.userId } })
      .catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'TemporaryUser not found');
      });
    const temporaryUserModel = new TemporaryUserModel(temporaryUserData);

    const latestPolicies = await this.policyRepository.findAllTypesOfLatestPolicies();
    const mandatoryPolicies = latestPolicies.filter((policy) => policy.isMandatory);
    const policyConsents = this.policyConsentFactory.createPolicyConsents(
      param.userId,
      latestPolicies,
      param.consentPolicyTypes,
    );

    temporaryUserModel.addPolicyConsents(policyConsents);
    temporaryUserModel.register(param, mandatoryPolicies);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.userRepository.save(temporaryUserModel.toRegisteredUserModelData());
      await this.temporaryUserRepository.delete(temporaryUserData.id);
      const authTokens = await this.authTokenDomainService.createAuthTokens({
        userId: temporaryUserModel.getId(),
        userRole: temporaryUserModel.getRole(),
      });
      await queryRunner.commitTransaction();
      return { authTokens };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
