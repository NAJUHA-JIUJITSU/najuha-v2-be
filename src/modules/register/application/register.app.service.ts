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
import { TemporaryUserModel } from '../../users/domain/model/temporary-user.model';
import { TemporaryUserRepository } from '../../../database/custom-repository/temporary-user.repository';
import { DataSource } from 'typeorm';
import { PolicyConsentModel } from '../../users/domain/model/policy-consent.model';
import { PolicyModel } from '../../policy/domain/model/policy.model';
import { RegistrationValidatorDomainService } from '../domain/registration-validator.domain.service';
import { UserFactory } from '../../users/domain/user.factory';

@Injectable()
export class RegisterAppService {
  constructor(
    private readonly authTokenDomainService: AuthTokenDomainService,
    private readonly phoneAuthCodeProvider: PhoneNumberAuthCodeDomainService,
    private readonly userFactory: UserFactory,
    private readonly userRepository: UserRepository,
    private readonly temporaryUserRepository: TemporaryUserRepository,
    private readonly policyRepository: PolicyRepository,
    private readonly registrationValidator: RegistrationValidatorDomainService,
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
    return assert<IsDuplicateNicknameRet>({
      isDuplicated: await this.registrationValidator.isDuplicateNickname({ userId, nickname }),
    });
  }

  // todo!: smsService 개발후 PhoneNumberAuthCode대신 null 반환으로 변환
  async sendPhoneNumberAuthCode({
    userId,
    phoneNumber,
  }: SendPhoneNumberAuthCodeParam): Promise<SendPhoneNumberAuthCodeRet> {
    const phoneNumberAuthCode = await this.phoneAuthCodeProvider.issuePhoneNumberAuthCode(userId, phoneNumber);
    // todo!: 인증코드를 전송 await this.smsService.sendAuthCode(phoneNumber, authCode);
    return assert<SendPhoneNumberAuthCodeRet>({ phoneNumberAuthCode });
  }

  async confirmAuthCode({ userId, authCode }: ConfirmAuthCodeParam): Promise<ConfirmAuthCodeRet> {
    const phoneNumber = await this.phoneAuthCodeProvider.validatePhoneNumberAuthCodeValid(userId, authCode);
    if (!phoneNumber) return { isConfirmed: false };
    const temporaryUserModel = new TemporaryUserModel(
      await this.temporaryUserRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'TemporaryUser not found');
      }),
    );
    temporaryUserModel.updataPhoneNumber(phoneNumber);
    await this.temporaryUserRepository.save(temporaryUserModel.toData());
    return { isConfirmed: true };
  }

  async registerUser({ userRegisterDto, consentPolicyTypes }: RegisterUserParam): Promise<RegisterUserRet> {
    const isDuplicated = await this.registrationValidator.isDuplicateNickname({
      userId: userRegisterDto.id,
      nickname: userRegisterDto.nickname,
    });
    if (isDuplicated) throw new BusinessException(RegisterErrors.REGISTER_NICKNAME_DUPLICATED);

    const temporaryUserModel = new TemporaryUserModel(
      await this.temporaryUserRepository.findOneOrFail({ where: { id: userRegisterDto.id } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'TemporaryUser not found');
      }),
    );

    const latestPolicyModels = (await this.policyRepository.findAllTypesOfLatestPolicies()).map(
      (entity) => new PolicyModel(entity),
    );
    const policyConsentModels = latestPolicyModels
      .filter((policy) => consentPolicyTypes.includes(policy.getType()))
      .map(
        (policy) =>
          new PolicyConsentModel(
            this.userFactory.createPolicyConsent({
              userId: userRegisterDto.id,
              policyId: policy.getId(),
            }),
          ),
      );

    temporaryUserModel.updateRegistrationData(policyConsentModels, userRegisterDto);
    this.registrationValidator.validateRegistration(temporaryUserModel, latestPolicyModels);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.userRepository.save(temporaryUserModel.toRegisteredUserModelData());
      await this.temporaryUserRepository.delete(temporaryUserModel.getId());
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
