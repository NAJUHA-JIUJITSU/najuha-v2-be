import { Injectable } from '@nestjs/common';
import { AuthErrors, BusinessException, CommonErrors } from 'src/common/response/errorResponse';
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
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/infrastructure/database/entity/user/user.entity';
import { Repository } from 'typeorm';
import { assert } from 'typia';
import { ITemporaryUser, IUser } from 'src/modules/users/domain/interface/user.interface';

@Injectable()
export class AuthAppService {
  constructor(
    private readonly snsAuthClient: SnsAuthClient,
    private readonly AuthTokenDomainService: AuthTokenDomainService,
    private readonly UserEntityFactory: UserEntityFactory,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async snsLogin(snsLoginParam: SnsLoginParam): Promise<SnsLoginRet> {
    const validatedUserData = await this.snsAuthClient.validate(snsLoginParam);
    let userEntity = assert<IUser | ITemporaryUser | null>(
      await this.userRepository.findOne({
        where: { snsId: validatedUserData.snsId, snsAuthProvider: validatedUserData.snsAuthProvider },
      }),
    );

    if (!userEntity) {
      userEntity = this.UserEntityFactory.creatTemporaryUser(validatedUserData);
      await this.userRepository.save(userEntity);
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
    const userEntity = assert<IUser | IUser>(
      await this.userRepository.findOneOrFail({ where: { id: userId } }).catch(() => {
        throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
      }),
    );
    const isCurrentAdmin = appEnv.adminCredentials.some(
      (adminCredential) =>
        adminCredential.snsId === userEntity.snsId && adminCredential.snsAuthProvider === userEntity.snsAuthProvider,
    );
    if (!isCurrentAdmin) throw new BusinessException(AuthErrors.AUTH_UNREGISTERED_ADMIN_CREDENTIALS);
    await this.userRepository.update(userId, { role: 'ADMIN' });
    const authTokens = await this.AuthTokenDomainService.createAuthTokens(userId, 'ADMIN');
    return { authTokens };
  }
}
