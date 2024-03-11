import { Injectable } from '@nestjs/common';
import { AuthTokensDto } from 'src/modules/auth/presentation/dto/auth-tokens.dto';
import { RefreshTokenDto } from 'src/modules/auth/presentation/dto/refresh-token.dto';
import { SnsAuthDto } from 'src/modules/auth/presentation/dto/sns-auth.dto';
import { UserEntity } from 'src/infrastructure/database/entities/user.entity';
import { AuthErrorMap, BusinessException } from 'src/common/response/errorResponse';
import { UsersRepository } from 'src/infrastructure/database/repositories/users.repository';
import { SnsAuthClient } from 'src/infrastructure/sns-auth-client/sns-auth.client';
import { AuthTokenDomainService } from '../domain/auth-token.domain.service';
import appEnv from 'src/common/app-env';

@Injectable()
export class AuthAppService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly snsAuthClient: SnsAuthClient,
    private readonly AuthTokenDomainService: AuthTokenDomainService,
  ) {}

  async snsLogin(snsAuthDto: SnsAuthDto): Promise<AuthTokensDto> {
    const userData = await this.snsAuthClient.validate(snsAuthDto);
    let user = await this.usersRepository.findOneBy({
      snsId: userData.snsId,
      snsAuthProvider: userData.snsAuthProvider,
    });

    if (!user) user = await this.usersRepository.save(userData);
    const authTokens = await this.AuthTokenDomainService.createAuthTokens(user.id, user.role);
    // TODO: 지우기
    console.log('authTokens', authTokens);
    return authTokens;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthTokensDto> {
    const { refreshToken } = refreshTokenDto;
    const payload = await this.AuthTokenDomainService.verifyRefreshToken(refreshToken);
    const authTokens = await this.AuthTokenDomainService.createAuthTokens(payload.userId, payload.userRole);

    return authTokens;
  }

  async acquireAdminRole(userId: UserEntity['id']): Promise<AuthTokensDto> {
    const user = await this.usersRepository.getOneOrFail({ where: { id: userId } });

    const isCurrentAdmin = appEnv.adminCredentials.some(
      (adminCredential) =>
        adminCredential.snsId === user.snsId && adminCredential.snsAuthProvider === user.snsAuthProvider,
    );
    if (!isCurrentAdmin) throw new BusinessException(AuthErrorMap.AUTH_UNREGISTERED_ADMIN_CREDENTIALS);

    await this.usersRepository.updateOrFail({ id: userId, role: 'ADMIN' });

    return await this.AuthTokenDomainService.createAuthTokens(userId, 'ADMIN');
  }
}
