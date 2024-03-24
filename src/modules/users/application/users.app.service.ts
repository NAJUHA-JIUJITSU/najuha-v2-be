import { Injectable } from '@nestjs/common';
import { CreateUserReqDto } from 'src/modules/users/dto/request/create-user.req.dto';
import { UpdateUserReqDto } from '../dto/request/update-user.req.dto';
import { UserResDto } from '../dto/response/user.res.dto';
import { UserRepository } from 'src/infrastructure/database/repository/user/user.repository';
import { User } from 'src/infrastructure/database/entities/user/user.entity';

@Injectable()
export class UsersAppService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: CreateUserReqDto): Promise<UserResDto> {
    return await this.userRepository.createUser(dto);
  }

  async updateUser(userId: User['id'], dto: UpdateUserReqDto): Promise<UserResDto> {
    return await this.userRepository.saveUser({ id: userId, ...dto });
  }

  async getMe(userId: User['id']): Promise<UserResDto> {
    return await this.userRepository.getUser({ where: { id: userId } });
  }
}
