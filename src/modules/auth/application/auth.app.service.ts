import { Injectable } from '@nestjs/common';
import { AuthErrorMap, BusinessException } from 'src/common/response/errorResponse';
import { UserRepository } from 'src/modules/users/user.repository';
import { SnsAuthClient } from 'src/modules/sns-auth-client/sns-auth.client';
import { AuthTokenDomainService } from '../domain/auth-token.domain.service';
import appEnv from 'src/common/app-env';
import {
  AcquireAdminRoleParam,
  AcquireAdminRoleRet,
  RefreshTokenParam,
  RefreshTokenRet,
  SnsLoginParam,
  SnsLoginRet,
} from './dtos';
import { UserEntityFactory } from 'src/modules/users/domain/user-entity.factory';

@Injectable()
export class AuthAppService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly snsAuthClient: SnsAuthClient,
    private readonly AuthTokenDomainService: AuthTokenDomainService,
    private readonly UserEntityFactory: UserEntityFactory,
  ) {}

  async snsLogin(snsLoginParam: SnsLoginParam): Promise<SnsLoginRet> {
    const validatedUserData = await this.snsAuthClient.validate(snsLoginParam);
    let userEntity = await this.userRepository.findUser({
      where: { snsId: validatedUserData.snsId, snsAuthProvider: validatedUserData.snsAuthProvider },
    });

    if (!userEntity) {
      userEntity = this.UserEntityFactory.creatTemporaryUser(validatedUserData);
      await this.userRepository.createUser(userEntity);
    }
    const authTokens = await this.AuthTokenDomainService.createAuthTokens(userEntity.id, userEntity.role);
    // TODO: 지우기
    console.log('authTokens', authTokens);
    return { authTokens };
  }

  async refreshToken({ refreshToken }: RefreshTokenParam): Promise<RefreshTokenRet> {
    const payload = await this.AuthTokenDomainService.verifyRefreshToken(refreshToken);
    const authTokens = await this.AuthTokenDomainService.createAuthTokens(payload.userId, payload.userRole);

    return { authTokens };
  }

  async acquireAdminRole({ userId }: AcquireAdminRoleParam): Promise<AcquireAdminRoleRet> {
    const user = await this.userRepository.getUser({ where: { id: userId } });
    const isCurrentAdmin = appEnv.adminCredentials.some(
      (adminCredential) =>
        adminCredential.snsId === user.snsId && adminCredential.snsAuthProvider === user.snsAuthProvider,
    );
    if (!isCurrentAdmin) throw new BusinessException(AuthErrorMap.AUTH_UNREGISTERED_ADMIN_CREDENTIALS);
    await this.userRepository.updateUser({ id: userId, role: 'ADMIN' });
    const authTokens = await this.AuthTokenDomainService.createAuthTokens(userId, 'ADMIN');
    return { authTokens };
  }
}
