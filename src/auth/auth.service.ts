import { Injectable } from '@nestjs/common';
import { AuthTokensDto } from 'src/auth/dto/auth-tokens.dto';
import { RefreshTokenDto } from 'src/auth/dto/refresh-token.dto';
import { SnsAuthDto } from 'src/sns-auth/dto/sns-auth.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthErrorMap, BusinessException } from 'src/common/response/errorResponse';
import { UsersRepository } from 'src/users/users.repository';
import { SnsAuthClient } from 'src/sns-auth/sns-auth.client';
import { AuthTokenProvider } from './auth-token.provider';
import appConfig from 'src/common/appConfig';

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
    return authTokens;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthTokensDto> {
    const { refreshToken } = refreshTokenDto;
    const payload = await this.authTokenProvider.verifyRefreshToken(refreshToken);
    const authTokens = await this.authTokenProvider.createAuthTokens(payload.userId, payload.userRole);

    return authTokens;
  }

  async acquireAdminRole(userId: UserEntity['id']): Promise<AuthTokensDto> {
    const user = await this.usersRepository.getOneOrFail({ id: userId });

    const isCurrentAdmin = appConfig.adminCredentials.some(
      (adminCredential) =>
        adminCredential.snsId === user.snsId && adminCredential.snsAuthProvider === user.snsAuthProvider,
    );
    if (!isCurrentAdmin) throw new BusinessException(AuthErrorMap.AUTH_UNREGISTERED_ADMIN_CREDENTIALS);

    await this.usersRepository.updateOrFail({ id: userId, role: 'ADMIN' });

    return await this.authTokenProvider.createAuthTokens(userId, 'ADMIN');
  }
}
