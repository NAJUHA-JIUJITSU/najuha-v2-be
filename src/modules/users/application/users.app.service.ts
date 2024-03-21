import { Injectable } from '@nestjs/common';
import { CreateUserReqDto } from 'src/modules/users/structure/dto/request/create-user.req.dto';
import { UpdateUserReqDto } from '../structure/dto/request/update-user.req.dto';
import { UserResDto } from '../structure/dto/response/user.res.dto';
import { IUser } from '../structure/user.interface';
import { UserRepository } from 'src/infrastructure/database/repository/user/user.repository';

@Injectable()
export class UsersAppService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: CreateUserReqDto): Promise<UserResDto> {
    return await this.userRepository.createUser(dto);
  }

  async updateUser(userId: IUser['id'], dto: UpdateUserReqDto): Promise<UserResDto> {
    return await this.userRepository.saveUser({ id: userId, ...dto });
  }

  async getMe(userId: IUser['id']): Promise<UserResDto> {
    return await this.userRepository.getUser({ where: { id: userId } });
  }
}
