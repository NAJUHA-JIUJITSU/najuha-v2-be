import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/users/user.repository';
import { UserEntityFactory } from '../domain/user-entity.factory';
import { CreateUserParam, CreateUserRet, GetMeParam, GetMeRet, UpdateUserParam, UpdateUserRet } from './dtos';

@Injectable()
export class UsersAppService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly UserEntityFactory: UserEntityFactory,
  ) {}

  async createUser({ userCreateDto }: CreateUserParam): Promise<CreateUserRet> {
    const user = await this.userRepository.createUser(this.UserEntityFactory.creatTemporaryUser(userCreateDto));
    return { user };
  }

  async updateUser({ userUpdateDto }: UpdateUserParam): Promise<UpdateUserRet> {
    const user = await this.userRepository.saveUser(userUpdateDto);
    return { user };
  }

  async getMe({ userId }: GetMeParam): Promise<GetMeRet> {
    const user = await this.userRepository.getUser({ where: { id: userId } });
    return { user };
  }
}
