import { Injectable } from '@nestjs/common';
import { CreateUserReqDto } from 'src/modules/users/dto/request/create-user.req.dto';
import { UserRepository } from 'src/infrastructure/database/repository/user.repository';
import { UpdateUserReqDto } from '../dto/request/update-user.req.dto';
import { UserResDto } from '../dto/response/user.res.dto';
import { User } from 'src/modules/users/domain/user.entity';

@Injectable()
export class UsersAppService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: CreateUserReqDto): Promise<UserResDto> {
    const user = this.userRepository.create(dto);
    return await this.userRepository.save(user);
  }

  async updateUser(userId: User['id'], dto: UpdateUserReqDto): Promise<UserResDto> {
    return await this.userRepository.saveOrFail({ id: userId, ...dto });
  }

  async getMe(userId: User['id']): Promise<UserResDto> {
    return await this.userRepository.getOneOrFail({ where: { id: userId } });
  }
}
