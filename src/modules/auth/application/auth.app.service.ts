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
import { UserFactory } from '../../users/domain/user.factory';
import { assert } from 'typia';
import { ITemporaryUser, IUser } from '../../users/domain/interface/user.interface';
import { UserRepository } from '../../../database/custom-repository/user.repository';

@Injectable()
export class AuthAppService {
  constructor(
    private readonly snsAuthClient: SnsAuthClient,
    private readonly AuthTokenDomainService: AuthTokenDomainService,
    private readonly UserFactory: UserFactory,
    private readonly userRepository: UserRepository,
  ) {}

  async snsLogin(snsLoginParam: SnsLoginParam): Promise<SnsLoginRet> {
    const validatedUserData = await this.snsAuthClient.validate(snsLoginParam);
    let userEntity = assert<IUser | ITemporaryUser | null>(
      await this.userRepository.findOne({
        where: { snsId: validatedUserData.snsId, snsAuthProvider: validatedUserData.snsAuthProvider },
      }),
    );
    if (!userEntity) {
      userEntity = this.UserFactory.creatTemporaryUser(validatedUserData);
      await this.userRepository.save(userEntity);
    }
    const authTokens = await this.AuthTokenDomainService.createAuthTokens({
      userId: userEntity.id,
      userRole: userEntity.role,
    });
    return { authTokens };
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
    const userEntity = assert<IUser>(
      await this.userRepository
        .findOneOrFail({ where: { id: userId }, relations: ['profileImages', 'profileImages.image'] })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
    );
    const isCurrentAdmin = appEnv.adminCredentials.some(
      (adminCredential) =>
        adminCredential.snsId === userEntity.snsId && adminCredential.snsAuthProvider === userEntity.snsAuthProvider,
    );
    if (!isCurrentAdmin) throw new BusinessException(AuthErrors.AUTH_UNREGISTERED_ADMIN_CREDENTIALS);
    await this.userRepository.update(userId, { role: 'ADMIN' });
    return { authTokens: await this.AuthTokenDomainService.createAuthTokens({ userId, userRole: 'ADMIN' }) };
  }
}
