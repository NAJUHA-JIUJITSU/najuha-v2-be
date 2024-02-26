import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from 'src/common/response/errorResponse';
import { UsersErrorMap } from 'src/common/response/errorResponse';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserWithRoleDto } from './dto/update-user-with-role.dto';

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

  async saveUser(userId: UserEntity['id'], dto: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
    return await this.userRepository.save({ ...user, ...dto });
  }

  async updateUser(userId: UserEntity['id'], dto: Partial<UserEntity>): Promise<void> {
    const result = await this.userRepository.update({ id: userId }, dto);
    if (!result.affected) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
  }

  async getUserById(userId: UserEntity['id']): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
    return user;
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

  async findUserByNickname(nickname: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { nickname },
    });
    return user;
  }
}
