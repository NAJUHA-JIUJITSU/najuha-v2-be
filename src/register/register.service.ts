import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { BusinessException, RegisterErrorMap } from 'src/common/response/errorResponse';
import { AuthTokensDto } from 'src/auth/dto/auth-tokens.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class RegisterService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  /**
   * 닉네임 중복 체크
   * - 닉네임이 중복되면 true, 중복되지 않으면 false를 반환
   * - 존재하지 않는 닉네임이면 false를 반존
   * - 존재하는 닉네임 이지만 본인이 사용중이면 false를 반환
   * - 존재하는 닉네임이면 true를 반환
   */
  async checkDuplicateNickname(userId: UserEntity['id'], nickname: string): Promise<boolean> {
    const user = await this.usersService.findUserByNickname(nickname);
    if (user === null) return false;
    if (user.id === userId) return false;
    return true;
  }

  async registerUser(userId: UserEntity['id'], dto: RegisterUserDto): Promise<AuthTokensDto> {
    if (dto.nickname && (await this.checkDuplicateNickname(userId, dto.nickname))) {
      throw new BusinessException(RegisterErrorMap.REGISTER_NICKNAME_DUPLICATED);
    }

    const user = await this.usersService.updateUser(userId, { ...dto, role: 'USER' });

    const authTokens = await this.authService.createAuthTokens(user.id, user.role);

    return authTokens;
  }
}
