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

const GUARD_LEVEL_KEY = 'gaurdLevel';
export enum GuardLevel {
  PUBLIC = 1,
  TEMPORARY_USER = 2,
  USER = 3,
  ADMIN = 4,
}
export const SetGuardLevel = (authLevel: GuardLevel) =>
  SetMetadata(GUARD_LEVEL_KEY, authLevel);

// TODO: 에러 표준화
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredGuardLevel = this.reflector.getAllAndOverride<GuardLevel>(
      GUARD_LEVEL_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (requiredGuardLevel === GuardLevel.PUBLIC) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeader(request);
    if (!accessToken) throw new UnauthorizedException();

    let payload: any;
    // TODO: 에러표준화, 함수로 분리
    try {
      payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
    // 사용자의 인증 레벨 검증
    this.validateGuardLevel(payload.userRole, requiredGuardLevel);

    request['userId'] = payload.userId;
    request['userRole'] = payload.userRole;

    return true;
  }

  private validateGuardLevel(
    userRole: string,
    requiredGuardLevel: GuardLevel,
  ): any {
    if (requiredGuardLevel > GuardLevel[userRole]) {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
