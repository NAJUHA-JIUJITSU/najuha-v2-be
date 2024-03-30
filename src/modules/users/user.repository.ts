import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException, CommonErrorMap } from 'src/common/response/errorResponse';
import { Repository } from 'typeorm';
import { UserEntity } from '../../infrastructure/database/entities/user/user.entity';
import { IUser } from './domain/user.interface';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(dto: Partial<IUser>): Promise<IUser> {
    const user = this.userRepository.create(dto);
    return await this.userRepository.save(user);
  }

  async findUser(options?: {
    where?: Partial<Pick<IUser, 'id' | 'snsId' | 'snsAuthProvider'>>;
    relations?: string[];
  }): Promise<IUser | null> {
    return await this.userRepository.findOne({ where: options?.where, relations: options?.relations });
  }

  async getUser(options: { where: Partial<Pick<IUser, 'id'>>; relations?: string[] }): Promise<IUser> {
    const user = await this.userRepository.findOne({ where: options.where, relations: options.relations });
    if (!user) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'User not found');
    return user;
  }

  async saveUser(dto: Pick<IUser, 'id'> & Partial<IUser>): Promise<IUser> {
    const user = await this.userRepository.findOne({ where: { id: dto.id } });
    if (!user) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'User not found');
    return await this.userRepository.save({ ...user, ...dto });
  }

  async updateUser(dto: Pick<IUser, 'id'> & Partial<IUser>): Promise<void> {
    const result = await this.userRepository.update({ id: dto.id }, dto);
    if (!result.affected) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'User not found');
  }
}
