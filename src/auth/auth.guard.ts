import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export enum AuthLevel {
  ADMIN = 4,
  USER = 3,
  TEMPORARY_USER = 2,
  PUBLIC = 1,
}
export const AUTH_LEVEL_KEY = 'authLevel';
export const SetAuthLevel = (authLevel: AuthLevel) =>
  SetMetadata(AUTH_LEVEL_KEY, authLevel);

// TODO: 에러 표준화
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAuthLevel = this.reflector.getAllAndOverride<AuthLevel>(
      AUTH_LEVEL_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (requiredAuthLevel === AuthLevel.PUBLIC) {
      return true; // PUBLIC 인 경우 accessToken 불필요, 인증 불필요
    }

    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeader(request);
    if (!accessToken) throw new UnauthorizedException();

    const payload = await this.jwtService.verifyAsync(accessToken, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
    // 사용자의 인증 레벨 검증
    this.validateAuthLevel(payload.userRole, requiredAuthLevel);

    request['userId'] = payload.userId;
    request['userRole'] = payload.userRole;

    return true;
  }

  private validateAuthLevel(
    userRole: string,
    requiredAuthLevel: AuthLevel,
  ): any {
    if (requiredAuthLevel > AuthLevel[userRole]) {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
