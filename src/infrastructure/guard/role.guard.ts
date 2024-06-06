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
  PUBLIC_OR_USER = 2,
  TEMPORARY_USER = 3,
  USER = 4,
  HOST = 5,
  ADMIN = 6,
}

export const RoleLevels = (roleLevel: RoleLevel) => SetMetadata(ROLE_LEVEL_KEY, roleLevel);

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoleLevel = this.getRequiredRoleLevel(context);
    const request = context.switchToHttp().getRequest<Request>();

    if (requiredRoleLevel === RoleLevel.PUBLIC) return true;

    const accessToken = this.extractTokenFromHeader(request);

    if (requiredRoleLevel === RoleLevel.PUBLIC_OR_USER && !accessToken) return true;

    if (!accessToken) {
      throw new BusinessException(AuthErrors.AUTH_ACCESS_TOKEN_MISSING);
    }

    const payload = this.verifyToken(accessToken);
    this.validateUserRoleLevel(payload.userRole, requiredRoleLevel);

    this.attachUserDetailsToRequest(request, payload);

    return true;
  }

  private getRequiredRoleLevel(context: ExecutionContext): RoleLevel {
    return this.reflector.getAllAndOverride<RoleLevel>(ROLE_LEVEL_KEY, [context.getHandler(), context.getClass()]);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
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

  private validateUserRoleLevel(userRole: string, requiredRoleLevel: RoleLevel): void {
    if (requiredRoleLevel > RoleLevel[userRole]) {
      throw new BusinessException(AuthErrors.AUTH_LEVEL_FORBIDDEN);
    }
  }

  private attachUserDetailsToRequest(request: Request, payload: IAuthTokenPayload): void {
    request['userId'] = payload.userId;
    request['userRole'] = payload.userRole;
  }
}
