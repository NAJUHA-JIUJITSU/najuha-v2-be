import { Injectable } from '@nestjs/common';
import { UserFactory } from '../domain/user.factory';
import { CreateUserParam, CreateUserRet, GetMeParam, GetMeRet, UpdateUserParam, UpdateUserRet } from './users.app.dtos';
import { assert } from 'typia';
import { IUser } from '../domain/interface/user.interface';
import { UserRepository } from '../../../database/custom-repository/user.repository';
import { BusinessException, CommonErrors } from '../../../common/response/errorResponse';

@Injectable()
export class UsersAppService {
  constructor(
    private readonly userFactory: UserFactory,
    private readonly userRepository: UserRepository,
  ) {}

  async createUser({ userCreateDto }: CreateUserParam): Promise<CreateUserRet> {
    const temporaryUserEntity = this.userFactory.creatTemporaryUser(userCreateDto);
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
    const userEntity = assert<IUser>(
      await this.userRepository
        .findOneOrFail({
          where: { id: userId },
          relations: ['profileImages', 'profileImages.image'],
        })
        .catch(() => {
          throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'User not found');
        }),
    );
    return { user: userEntity };
  }
}
