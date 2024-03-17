import { Injectable } from '@nestjs/common';
import { CreateUserReqDto } from 'src/modules/users/dto/request/create-user.req.dto';
import { UsersRepository } from 'src/modules/users/repository/users.repository';
import { UpdateUserReqDto } from '../dto/request/update-user.req.dto';
import { UserResDto } from '../dto/response/user.res.dto';
import { User } from 'src/modules/users/domain/user.entity';

@Injectable()
export class UsersAppService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(dto: CreateUserReqDto): Promise<UserResDto> {
    const user = this.usersRepository.create(dto);
    return await this.usersRepository.save(user);
  }

  async updateUser(userId: User['id'], dto: UpdateUserReqDto): Promise<UserResDto> {
    return await this.usersRepository.saveOrFail({ id: userId, ...dto });
  }

  async getMe(userId: User['id']): Promise<UserResDto> {
    return await this.usersRepository.getOneOrFail({ where: { id: userId } });
  }
}
