import { Injectable } from '@nestjs/common';
import { AuthTokensDto } from 'src/modules/auth/dto/auth-tokens.dto';
import { RefreshTokenDto } from 'src/modules/auth/dto/refresh-token.dto';
import { SnsAuthDto } from 'src/modules/auth/dto/sns-auth.dto';
import { UserEntity } from 'src/infra/database/entities/user.entity';
import { AuthErrorMap, BusinessException } from 'src/common/response/errorResponse';
import { UsersRepository } from 'src/infra/database/repositories/users.repository';
import { SnsAuthClient } from 'src/infra/sns-auth-client/sns-auth.client';
import { AuthTokenProvider } from './auth-token.provider';
import appEnv from 'src/common/app-env';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly snsAuthClient: SnsAuthClient,
    private readonly authTokenProvider: AuthTokenProvider,
  ) {}

  async snsLogin(snsAuthDto: SnsAuthDto): Promise<AuthTokensDto> {
    const userData = await this.snsAuthClient.validate(snsAuthDto);
    let user = await this.usersRepository.findOneBy({
      snsId: userData.snsId,
      snsAuthProvider: userData.snsAuthProvider,
    });

    if (!user) user = await this.usersRepository.save(userData);
    const authTokens = await this.authTokenProvider.createAuthTokens(user.id, user.role);
    // TODO: 지우기
    console.log('authTokens', authTokens);
    return authTokens;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthTokensDto> {
    const { refreshToken } = refreshTokenDto;
    const payload = await this.authTokenProvider.verifyRefreshToken(refreshToken);
    const authTokens = await this.authTokenProvider.createAuthTokens(payload.userId, payload.userRole);

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

    return await this.authTokenProvider.createAuthTokens(userId, 'ADMIN');
  }
}
