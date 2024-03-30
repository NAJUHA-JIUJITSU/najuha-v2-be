import { Injectable } from '@nestjs/common';
import { CreateUserReqDto } from 'src/modules/users/structure/dto/request/create-user.req.dto';
import { UpdateUserReqDto } from '../structure/dto/request/update-user.req.dto';
import { UserRepository } from 'src/modules/users/user.repository';
import { IUser } from '../domain/user.interface';

@Injectable()
export class UsersAppService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: CreateUserReqDto): Promise<IUser> {
    return await this.userRepository.createUser(dto);
  }

  async updateUser(userId: IUser['id'], dto: UpdateUserReqDto): Promise<IUser> {
    return await this.userRepository.saveUser({ id: userId, ...dto });
  }

  async getMe(userId: IUser['id']): Promise<IUser> {
    return await this.userRepository.getUser({ where: { id: userId } });
  }
}
