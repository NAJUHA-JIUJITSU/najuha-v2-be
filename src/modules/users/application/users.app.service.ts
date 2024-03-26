import { Injectable } from '@nestjs/common';
import { CreateUserReqDto } from 'src/modules/users/structure/dto/request/create-user.req.dto';
import { UpdateUserReqDto } from '../structure/dto/request/update-user.req.dto';
import { UserRepository } from 'src/modules/users/user.repository';
import { User } from 'src/modules/users/domain/entities/user.entity';

@Injectable()
export class UsersAppService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: CreateUserReqDto): Promise<User> {
    return await this.userRepository.createUser(dto);
  }

  async updateUser(userId: User['id'], dto: UpdateUserReqDto): Promise<User> {
    return await this.userRepository.saveUser({ id: userId, ...dto });
  }

  async getMe(userId: User['id']): Promise<User> {
    return await this.userRepository.getUser({ where: { id: userId } });
  }
}
