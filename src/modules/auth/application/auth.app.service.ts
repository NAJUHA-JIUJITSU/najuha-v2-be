import { Injectable } from '@nestjs/common';
import { RefreshTokenReqDto } from 'src/modules/auth/structure/dto/request/refresh-token.dto';
import { SnsLoginReqDto } from 'src/modules/auth/structure/dto/request/sns-login.dto';
import { AuthErrorMap, BusinessException } from 'src/common/response/errorResponse';
import { UserRepository } from 'src/modules/users/user.repository';
import { SnsAuthClient } from 'src/infrastructure/sns-auth-client/sns-auth.client';
import { AuthTokenDomainService } from '../domain/auth-token.domain.service';
import { IAuthTokens } from '../structure/auth-tokens.interface';
import appEnv from 'src/common/app-env';
import { IUser } from 'src/modules/users/domain/user.interface';

@Injectable()
export class AuthAppService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly snsAuthClient: SnsAuthClient,
    private readonly AuthTokenDomainService: AuthTokenDomainService,
  ) {}

  async snsLogin(SnsLoginReqDto: SnsLoginReqDto): Promise<IAuthTokens> {
    const userData = await this.snsAuthClient.validate(SnsLoginReqDto);
    let user = await this.userRepository.findUser({
      where: { snsId: userData.snsId, snsAuthProvider: userData.snsAuthProvider },
    });

    if (!user) user = await this.userRepository.createUser(userData);
    const authTokens = await this.AuthTokenDomainService.createAuthTokens(user.id, user.role);
    // TODO: 지우기
    console.log('authTokens', authTokens);
    return authTokens;
  }

  async refreshToken(RefreshTokenReqDto: RefreshTokenReqDto): Promise<IAuthTokens> {
    const { refreshToken } = RefreshTokenReqDto;
    const payload = await this.AuthTokenDomainService.verifyRefreshToken(refreshToken);
    const authTokens = await this.AuthTokenDomainService.createAuthTokens(payload.userId, payload.userRole);

    return authTokens;
  }

  async acquireAdminRole(userId: IUser['id']): Promise<IAuthTokens> {
    const user = await this.userRepository.getUser({ where: { id: userId } });

    const isCurrentAdmin = appEnv.adminCredentials.some(
      (adminCredential) =>
        adminCredential.snsId === user.snsId && adminCredential.snsAuthProvider === user.snsAuthProvider,
    );
    if (!isCurrentAdmin) throw new BusinessException(AuthErrorMap.AUTH_UNREGISTERED_ADMIN_CREDENTIALS);

    await this.userRepository.updateUser({ id: userId, role: 'ADMIN' });

    return await this.AuthTokenDomainService.createAuthTokens(userId, 'ADMIN');
  }
}
