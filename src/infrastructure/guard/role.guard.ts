import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthErrors, BusinessException } from 'src/common/response/errorResponse';
import appEnv from 'src/common/app-env';

const ROLE_LEVEL_KEY = Symbol('roleLevel');

export enum RoleLevel {
  PUBLIC = 1,
  TEMPORARY_USER = 2,
  USER = 3,
  ADMIN = 4,
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
    if (requiredRoleLevel === RoleLevel.PUBLIC) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeader(request);
    if (!accessToken) throw new BusinessException(AuthErrors.AUTH_ACCESS_TOKEN_MISSING);

    const payload = await this.verifyToken(accessToken);

    // 사용자의 인증 레벨 검증
    this.validateRoleLevel(payload.userRole, requiredRoleLevel);

    request['userId'] = payload.userId;
    request['userRole'] = payload.userRole;

    return true;
  }

  private async verifyToken(accessToken: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(accessToken, {
        secret: appEnv.jwtAccessTokenSecret,
      });
    } catch (e: any) {
      // TODO: any 타입 수정 필요
      throw new BusinessException(AuthErrors.AUTH_ACCESS_TOKEN_UNAUTHORIZED, e.message);
    }
  }

  private validateRoleLevel(userRole: string, requiredRoleLevel: RoleLevel): any {
    if (requiredRoleLevel > RoleLevel[userRole]) {
      throw new BusinessException(AuthErrors.AUTH_LEVEL_FORBIDDEN);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
