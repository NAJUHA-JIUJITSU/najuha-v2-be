import { Injectable } from '@nestjs/common';
import { AuthErrors, BusinessException, CommonErrors } from '../../../common/response/errorResponse';
import { SnsAuthClient } from '../../sns-auth-client/sns-auth.client';
import { AuthTokenDomainService } from '../domain/auth-token.domain.service';
import appEnv from '../../../common/app-env';
import {
  AcquireAdminRoleParam,
  AcquireAdminRoleRet,
  RefreshTokenParam,
  RefreshTokenRet,
  SnsLoginParam,
  SnsLoginRet,
} from './auth.app.dto';
import { UserRepository } from '../../../database/custom-repository/user.repository';
import { TemporaryUserRepository } from '../../../database/custom-repository/temporary-user.repository';
import { UserFactory } from '../../users/domain/user.factory';

@Injectable()
export class AuthAppService {
  constructor(
    private readonly snsAuthClient: SnsAuthClient,
    private readonly AuthTokenDomainService: AuthTokenDomainService,
    private readonly userRepository: UserRepository,
    private readonly temporaryUserRepository: TemporaryUserRepository,
    private readonly userFactory: UserFactory,
  ) {}

  async snsLogin(snsLoginParam: SnsLoginParam): Promise<SnsLoginRet> {
    const validatedUserData = await this.snsAuthClient.validate(snsLoginParam);
    let user = await this.userRepository.findOne({
      where: { snsId: validatedUserData.snsId, snsAuthProvider: validatedUserData.snsAuthProvider },
    });
    if (user) {
      // 이미 회원가입된 유저
      return {
        authTokens: await this.AuthTokenDomainService.createAuthTokens({
          userId: user.id,
          userRole: user.role,
        }),
      };
    }
    const temporaryUser = await this.temporaryUserRepository.findOne({
      where: { snsId: validatedUserData.snsId, snsAuthProvider: validatedUserData.snsAuthProvider },
    });
    if (temporaryUser) {
      // 이미 최초 로그인한 유저
      return {
        authTokens: await this.AuthTokenDomainService.createAuthTokens({
          userId: temporaryUser.id,
          userRole: temporaryUser.role,
        }),
      };
    }
    // 최초 로그인
    const newTemporaryUserModelData = this.userFactory.createTemporaryUser(validatedUserData);
    await this.temporaryUserRepository.save(newTemporaryUserModelData);
    return {
      authTokens: await this.AuthTokenDomainService.createAuthTokens({
        userId: newTemporaryUserModelData.id,
        userRole: newTemporaryUserModelData.role,
      }),
    };
  }

  async refreshToken({ refreshToken }: RefreshTokenParam): Promise<RefreshTokenRet> {
    const payload = await this.AuthTokenDomainService.verifyRefreshToken(refreshToken);
    const authTokens = await this.AuthTokenDomainService.createAuthTokens({
      userId: payload.userId,
      userRole: payload.userRole,
    });
    return { authTokens };
  }

  async acquireAdminRole({ userId }: AcquireAdminRoleParam): Promise<AcquireAdminRoleRet> {
    const userEntity = await this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
    });
    const isCurrentAdmin = appEnv.adminCredentials.some(
      (adminCredential) =>
        adminCredential.snsId === userEntity.snsId && adminCredential.snsAuthProvider === userEntity.snsAuthProvider,
    );
    if (!isCurrentAdmin) throw new BusinessException(AuthErrors.AUTH_UNREGISTERED_ADMIN_CREDENTIALS);
    await this.userRepository.update(userId, { role: 'ADMIN' });
    return { authTokens: await this.AuthTokenDomainService.createAuthTokens({ userId, userRole: 'ADMIN' }) };
  }
}
