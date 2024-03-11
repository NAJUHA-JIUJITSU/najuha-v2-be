import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/presentation/dto/create-user.dto';
import { IUser } from 'src/interfaces/user.interface';
import { UsersRepository } from 'src/infrastructure/database/repositories/users.repository';
import { UpdateUserDto } from '../presentation/dto/update-user.dto';

@Injectable()
export class UsersAppService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(dto: CreateUserDto): Promise<IUser> {
    const user = this.usersRepository.create(dto);
    return await this.usersRepository.save(user);
  }

  async updateUser(userId: IUser['id'], dto: UpdateUserDto): Promise<IUser> {
    return await this.usersRepository.saveOrFail({ id: userId, ...dto });
  }

  async getMe(userId: IUser['id']): Promise<IUser> {
    return await this.usersRepository.getOneOrFail({ where: { id: userId } });
  }
}
