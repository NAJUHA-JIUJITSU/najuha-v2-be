import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException, CommonErrorMap } from 'src/common/response/errorResponse';
import { Repository } from 'typeorm';
import { UserEntity } from '../../infrastructure/database/entity/user/user.entity';
import { IUser } from './domain/interface/user.interface';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(entity: IUser.Entity.TemporaryUser): Promise<IUser.Entity.TemporaryUser> {
    return await this.userRepository.save(entity);
  }

  async saveUser(
    entity: Pick<IUser, 'id'> & Partial<IUser.Entity.TemporaryUser | IUser.Entity.User>,
  ): Promise<IUser.Entity.TemporaryUser | IUser.Entity.User> {
    const user = await this.findUser({ where: { id: entity.id } });
    if (!user) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'User not found');
    return await this.userRepository.save({ ...user, ...entity });
  }

  async findUser(options?: {
    where?: Partial<Pick<IUser, 'id' | 'snsId' | 'snsAuthProvider'>>;
    relations?: string[];
  }): Promise<IUser.Entity.TemporaryUser | IUser.Entity.User | null> {
    return await this.userRepository.findOne({ where: options?.where, relations: options?.relations });
  }

  async getUser(options: {
    where: Partial<Pick<IUser, 'id'>>;
    relations?: string[];
  }): Promise<IUser.Entity.TemporaryUser | IUser.Entity.User> {
    const user = await this.userRepository.findOne({ where: options.where, relations: options.relations });
    if (!user) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'User not found');
    return user;
  }

  async updateUser(entity: Pick<IUser, 'id'> & Partial<IUser.Entity.TemporaryUser | IUser.Entity.User>): Promise<void> {
    const result = await this.userRepository.update(entity.id, entity);
    if (!result.affected) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'User not found');
  }
}
