import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UserEntity } from 'src/infra/database/entities/user.entity';
import { UsersRepository } from '../../../infra/database/repositories/users.repository';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const user = this.usersRepository.create(dto);
    return await this.usersRepository.save(user);
  }

  async updateUser(userId: UserEntity['id'], dto: UpdateUserDto): Promise<UserEntity> {
    return await this.usersRepository.saveOrFail({ id: userId, ...dto });
  }

  async getMe(userId: UserEntity['id']): Promise<UserEntity> {
    return await this.usersRepository.getOneOrFail({ where: { id: userId } });
  }
}
