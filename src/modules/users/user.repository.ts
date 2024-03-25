import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from 'src/common/response/errorResponse';
import { UsersErrorMap } from 'src/common/response/errorResponse';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './domain/entities/user.entity';

// @Injectable()
// export class UserRepository extends Repository<User> {
//   constructor(private dataSource: DataSource) {
//     super(User, dataSource.createManager());
//   }

//   async saveOrFail(dto: Pick<User, 'id'> & Partial<User>): Promise<User> {
//     const user = await this.findOne({ where: { id: dto.id } });
//     if (!user) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
//     return await this.save({ ...user, ...dto });
//   }

//   async updateOrFail(dto: Pick<User, 'id'> & Partial<User>): Promise<void> {
//     const result = await this.update({ id: dto.id }, dto);
//     if (!result.affected) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
//   }

//   async getOneOrFail({ where, relations }: FindOneOptions<User>): Promise<User> {
//     const user = await this.findOne({ where, relations });
//     if (!user) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
//     return user;
//   }
// }

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(dto: Partial<User>): Promise<User> {
    const user = this.userRepository.create(dto);
    return await this.userRepository.save(user);
  }

  async findUser({ where, relations }: FindOneOptions<User>): Promise<User | null> {
    return await this.userRepository.findOne({ where, relations });
  }

  async getUser({ where, relations }: FindOneOptions<User>): Promise<User> {
    const user = await this.userRepository.findOne({ where, relations });
    if (!user) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
    return user;
  }

  async saveUser(dto: Pick<User, 'id'> & Partial<User>): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: dto.id } });
    if (!user) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
    return await this.userRepository.save({ ...user, ...dto });
  }

  async updateUser(dto: Pick<User, 'id'> & Partial<User>): Promise<void> {
    const result = await this.userRepository.update({ id: dto.id }, dto);
    if (!result.affected) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
  }
}
