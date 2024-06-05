import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthErrors, BusinessException } from 'src/common/response/errorResponse';
import appEnv from 'src/common/app-env';
import { IAuthTokenPayload } from 'src/modules/auth/domain/interface/auth-token-payload.interface';

const ROLE_LEVEL_KEY = Symbol('roleLevel');

export enum RoleLevel {
  PUBLIC = 1,
  TEMPORARY_USER = 2,
  USER = 3,
  HOST = 4,
  ADMIN = 5,
}

export const RoleLevels = (roleLevel: RoleLevel) => SetMetadata(ROLE_LEVEL_KEY, roleLevel);

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoleLevel = this.reflector.getAllAndOverride<RoleLevel>(ROLE_LEVEL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (requiredRoleLevel === RoleLevel.PUBLIC) return true;

    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeader(request);
    if (!accessToken) throw new BusinessException(AuthErrors.AUTH_ACCESS_TOKEN_MISSING);

    const payload = this.verifyToken(accessToken);

    // 사용자의 인증 레벨 검증
    this.validateUserRoleLevel(payload.userRole, requiredRoleLevel);

    request['userId'] = payload.userId;
    request['userRole'] = payload.userRole;

    return true;
  }

  private verifyToken(accessToken: string): IAuthTokenPayload {
    try {
      return this.jwtService.verify(accessToken, {
        secret: appEnv.jwtAccessTokenSecret,
      });
    } catch (e: any) {
      throw new BusinessException(AuthErrors.AUTH_ACCESS_TOKEN_UNAUTHORIZED, e.message);
    }
  }

  private validateUserRoleLevel(userRole: string, requiredRoleLevel: RoleLevel): any {
    if (requiredRoleLevel > RoleLevel[userRole]) {
      throw new BusinessException(AuthErrors.AUTH_LEVEL_FORBIDDEN);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
