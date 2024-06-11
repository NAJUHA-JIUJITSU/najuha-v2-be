import { Injectable } from '@nestjs/common';
import appEnv from '../../../common/app-env';
import { AuthTokenDomainService } from '../../auth/domain/auth-token.domain.service';
import { IAdminAccessToken } from '../presentation/api-conventions.controller.dto';

@Injectable()
export class ApiConventionsAppService {
  constructor(private readonly AuthTokenDomainService: AuthTokenDomainService) {}

  async createAdminAccessToken() {
    let adminAccessTokens: IAdminAccessToken[] = [];
    adminAccessTokens = await Promise.all(
      appEnv.adminCredentials.map(async (adminCredential) => {
        const authTokens = await this.AuthTokenDomainService.createAuthTokens({
          userId: adminCredential.id,
          userRole: 'ADMIN',
        });
        return {
          name: adminCredential.name,
          accessToken: authTokens.accessToken,
          refreshToken: authTokens.refreshToken,
        };
      }),
    );
    return {
      adminAccessTokens,
    };
  }
}
