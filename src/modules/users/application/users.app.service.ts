import { Injectable } from '@nestjs/common';
import { UserEntityFactory } from '../domain/user-entity.factory';
import { CreateUserParam, CreateUserRet, GetMeParam, GetMeRet, UpdateUserParam, UpdateUserRet } from './dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/infrastructure/database/entity/user/user.entity';
import { Repository } from 'typeorm';
import { assert } from 'typia';
import { IUser } from '../domain/interface/user.interface';

@Injectable()
export class UsersAppService {
  constructor(
    private readonly userEntityFactory: UserEntityFactory,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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
