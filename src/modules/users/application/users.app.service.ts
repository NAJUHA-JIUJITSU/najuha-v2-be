import { Injectable } from '@nestjs/common';
import { UserEntityFactory } from '../domain/user-entity.factory';
import { CreateUserParam, CreateUserRet, GetMeParam, GetMeRet, UpdateUserParam, UpdateUserRet } from './dtos';
import { assert } from 'typia';
import { IUser } from '../domain/interface/user.interface';
import { UserRepository } from 'src/infrastructure/database/custom-repository/user.repository';

@Injectable()
export class UsersAppService {
  constructor(
    private readonly userEntityFactory: UserEntityFactory,
    private readonly userRepository: UserRepository,
  ) {}

  async createUser({ userCreateDto }: CreateUserParam): Promise<CreateUserRet> {
    const temporaryUserEntity = this.userEntityFactory.creatTemporaryUser(userCreateDto);
    await this.userRepository.save(temporaryUserEntity);
    return { user: temporaryUserEntity };
  }

  async updateUser({ userUpdateDto }: UpdateUserParam): Promise<UpdateUserRet> {
    const userEntity = assert<IUser>(await this.userRepository.findOne({ where: { id: userUpdateDto.id } }));
    const updatedUserEntity = { ...userEntity, ...userUpdateDto };
    await this.userRepository.save(updatedUserEntity);
    return { user: updatedUserEntity };
  }

  async getMe({ userId }: GetMeParam): Promise<GetMeRet> {
    const userEntity = assert<IUser>(await this.userRepository.findOne({ where: { id: userId } }));
    return { user: userEntity };
  }
}
