import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from 'src/common/response/errorResponse';
import { UsersErrorMap } from 'src/common/response/errorResponse';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

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

  async updateUser(userId: UserEntity['id'], dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BusinessException(UsersErrorMap.USERS_NOT_FOUND);
    return await this.userRepository.save({ ...user, ...dto });
  }

  async updateUserRole(userId: UserEntity['id'], role: UserEntity['role']): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BusinessException(UsersErrorMap.USERS_NOT_FOUND);
    return await this.userRepository.save({ ...user, role });
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
