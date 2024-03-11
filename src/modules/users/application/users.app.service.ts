import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/presentation/dto/create-user.dto';
import { UserEntity } from 'src/infrastructure/database/entities/user.entity';
import { UsersRepository } from '../../../infrastructure/database/repositories/users.repository';
import { UpdateUserDto } from '../presentation/dto/update-user.dto';

@Injectable()
export class UsersAppService {
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
