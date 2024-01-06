import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<CreateUserDto> {
    const user = this.userRepository.create(dto);
    await this.userRepository.save(user);
    return user;
  }

  async updateUser(snsId: number, dto: CreateUserDto): Promise<any> {
    const user = await this.userRepository.update({ snsId: snsId }, dto);
    return user;
  }

  async getUsers(): Promise<any> {
    const users = await this.userRepository.find();
    return users;
  }

  async getUserById(id: number): Promise<any> {
    const user = await this.userRepository.findOne({ where: { snsId: id } });
    if (!user) {
      console.log('해당 ID를 가진 사용자가 존재하지 않습니다.');
      return null; // 또는 적절한 오류 처리를 수행
    }
    return user;
  }
}
