import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { ExpectedError } from '../common/error';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(dto);
    return await this.userRepository.save(user);
  }

  async updateUser(
    userId: UserEntity['id'],
    dto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new ExpectedError('NOT_FOUND_USER');
    return await this.userRepository.save({ ...user, ...dto });
  }

  async findUserBySnsIdAndProvider(
    snsAuthProvider: UserEntity['snsAuthProvider'],
    snsId: UserEntity['snsId'],
  ): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { snsId, snsAuthProvider },
    });
  }

  async findUserById(userId: UserEntity['id']): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return user;
  }
}
