import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    return await this.usersRepository.save(dto);
  }

  async updateUser(userId: UserEntity['id'], dto: UpdateUserDto): Promise<UserEntity> {
    return await this.usersRepository.save({ id: userId, ...dto });
  }

  async getUser(userId: UserEntity['id']): Promise<UserEntity> {
    return await this.usersRepository.getOneOrFail({ id: userId });
  }
}
