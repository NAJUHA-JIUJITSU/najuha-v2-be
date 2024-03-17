import { Injectable } from '@nestjs/common';
import { AuthTokensResDto } from 'src/modules/auth/dto/response/auth-tokens.res.dto';
import { RefreshTokenReqDto } from 'src/modules/auth/dto/request/refresh-token.dto';
import { SnsLoginReqDto } from 'src/modules/auth/dto/request/sns-login.dto';
import { User } from 'src/modules/users/domain/user.entity';
import { AuthErrorMap, BusinessException } from 'src/common/response/errorResponse';
import { UserRepository } from 'src/infrastructure/database/repository/user.repository';
import { SnsAuthClient } from 'src/infrastructure/sns-auth-client/sns-auth.client';
import { AuthTokenDomainService } from '../domain/auth-token.domain.service';
import appEnv from 'src/common/app-env';

@Injectable()
export class AuthAppService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly snsAuthClient: SnsAuthClient,
    private readonly AuthTokenDomainService: AuthTokenDomainService,
  ) {}

  async snsLogin(SnsLoginReqDto: SnsLoginReqDto): Promise<AuthTokensResDto> {
    const userData = await this.snsAuthClient.validate(SnsLoginReqDto);
    let user = await this.userRepository.findOneBy({
      snsId: userData.snsId,
      snsAuthProvider: userData.snsAuthProvider,
    });

    if (!user) user = await this.userRepository.save(userData);
    const authTokens = await this.AuthTokenDomainService.createAuthTokens(user.id, user.role);
    // TODO: 지우기
    console.log('authTokens', authTokens);
    return authTokens;
  }

  async refreshToken(RefreshTokenReqDto: RefreshTokenReqDto): Promise<AuthTokensResDto> {
    const { refreshToken } = RefreshTokenReqDto;
    const payload = await this.AuthTokenDomainService.verifyRefreshToken(refreshToken);
    const authTokens = await this.AuthTokenDomainService.createAuthTokens(payload.userId, payload.userRole);

    return authTokens;
  }

  async acquireAdminRole(userId: User['id']): Promise<AuthTokensResDto> {
    const user = await this.userRepository.getOneOrFail({ where: { id: userId } });

    const isCurrentAdmin = appEnv.adminCredentials.some(
      (adminCredential) =>
        adminCredential.snsId === user.snsId && adminCredential.snsAuthProvider === user.snsAuthProvider,
    );
    if (!isCurrentAdmin) throw new BusinessException(AuthErrorMap.AUTH_UNREGISTERED_ADMIN_CREDENTIALS);

    await this.userRepository.updateOrFail({ id: userId, role: 'ADMIN' });

    return await this.AuthTokenDomainService.createAuthTokens(userId, 'ADMIN');
  }
}
