import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { NOT_FOUND_USER } from '../common/error';
import { HttpExceptionFactory } from '..//common/error';
import typia from 'typia';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(dto);
    return await this.userRepository.save(user);
  }

  async updateUser(dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: dto.id } });
    return await this.userRepository.save({ ...user, ...dto });
  }

  async findUserBySnsIdaAndSnsProvider(
    snsId: UserEntity['snsId'],
    snsProvider: UserEntity['snsProvider'],
  ): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { snsId, snsProvider } });
  }

  async findUserById(userId: UserEntity['id']): Promise<UserEntity> {
    const ret = await this.userRepository.findOne({ where: { id: userId } });
    if (!ret) throw HttpExceptionFactory.create(typia.random<NOT_FOUND_USER>());
    console.log(ret);
    return ret;
  }
}
