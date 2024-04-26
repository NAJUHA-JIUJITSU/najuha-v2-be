import { Injectable } from '@nestjs/common';
import { BusinessException, CommonErrors, RegisterErrors } from 'src/common/response/errorResponse';
import { AuthTokenDomainService } from 'src/modules/auth/domain/auth-token.domain.service';
import { PhoneNumberAuthCodeDomainService } from '../domain/phone-number-auth-code.domain.service';
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
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/infrastructure/database/entity/user/user.entity';
import { Repository } from 'typeorm';
import { assert } from 'typia';
import { IRegisterUser, ITemporaryUser, IUser } from 'src/modules/users/domain/interface/user.interface';
import { PolicyEntity } from 'src/infrastructure/database/entity/policy/policy.entity';
import { IPolicy } from 'src/modules/policy/domain/interface/policy.interface';

@Injectable()
export class RegisterAppService {
  constructor(
    private readonly authTokenDomainService: AuthTokenDomainService,
    private readonly phoneAuthCodeProvider: PhoneNumberAuthCodeDomainService,
    private readonly regiterUserEntityFactory: RegisterUserEntityFactory,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PolicyEntity)
    private readonly policyRepository: Repository<PolicyEntity>,
  ) {}

  async getTemporaryUser({ userId }: GetTemporaryUserParam): Promise<GetTemporaryUserRet> {
    const temporaryUserEntity = assert<ITemporaryUser>(
      await this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
      }),
    );
    return { user: temporaryUserEntity };
  }

  /**
   * 닉네임 중복 체크
   * - 존재하지 않는 닉네임이면 false를 반존
   * - 존재하는 닉네임 이지만 본인이 사용중이면 false를 반환
   * - 존재하는 닉네임이면 true를 반환
   */
  async isDuplicateNickname({ userId, nickname }: IsDuplicateNicknameParam): Promise<IsDuplicateNicknameRet> {
    // domain service로 분리 ?
    const userEntity = assert<IUser | ITemporaryUser | null>(
      await this.userRepository.findOne({ where: { nickname } }),
    );
    if (userEntity === null) return { isDuplicated: false };
    if (userEntity.id === userId) return { isDuplicated: false };
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
    if (isDuplicated) throw new BusinessException(RegisterErrors.REGISTER_NICKNAME_DUPLICATED);
    let registerUserEntity = assert<IRegisterUser>(
      await this.userRepository
        .findOneOrFail({
          where: { id: userRegisterDto.id },
          relations: ['policyConsents'],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
    );

    // findAllTypesOfLatestPolicies
    const latestPolicies = assert<IPolicy[]>(
      await this.policyRepository
        .createQueryBuilder('policy')
        .distinctOn(['policy.type'])
        .orderBy('policy.type')
        .addOrderBy('policy.createdAt', 'DESC')
        .getMany(),
    );
    const mandatoryPolicies = latestPolicies.filter((policy) => policy.isMandatory);

    registerUserEntity = await this.regiterUserEntityFactory.createRegisterUser(
      registerUserEntity,
      latestPolicies,
      consentPolicyTypes,
    );

    const registerUserModel = new RegisterUserModel(registerUserEntity);
    registerUserModel.register(userRegisterDto, mandatoryPolicies);

    await this.userRepository.save(registerUserModel.toEntity());

    const authTokens = await this.authTokenDomainService.createAuthTokens(
      registerUserModel.getId(),
      registerUserModel.getRole(),
    );
    return { authTokens };
  }
}
