import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from 'src/common/response/errorResponse';
import { UsersErrorMap } from 'src/common/response/errorResponse';
import { UserEntity } from 'src/infrastructure/database/entities/user/user.entity';
import { IUser } from 'src/modules/users/structure/user.interface';
import { Repository } from 'typeorm';

// @Injectable()
// export class UserRepository extends Repository<UserEntity> {
//   constructor(private dataSource: DataSource) {
//     super(UserEntity, dataSource.createEntityManager());
//   }

//   async saveOrFail(dto: Pick<UserEntity, 'id'> & Partial<UserEntity>): Promise<UserEntity> {
//     const user = await this.findOne({ where: { id: dto.id } });
//     if (!user) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
//     return await this.save({ ...user, ...dto });
//   }

//   async updateOrFail(dto: Pick<UserEntity, 'id'> & Partial<UserEntity>): Promise<void> {
//     const result = await this.update({ id: dto.id }, dto);
//     if (!result.affected) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
//   }

//   async getOneOrFail({ where, relations }: FindOneOptions<UserEntity>): Promise<UserEntity> {
//     const user = await this.findOne({ where, relations });
//     if (!user) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
//     return user;
//   }
// }

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

  async findUser(options?: { where?: Partial<IUser>; relations?: string[] }): Promise<IUser | null> {
    const user = await this.userRepository.findOne({ where: options?.where, relations: options?.relations });
    return user;
  }

  async getUser(options?: { where?: Partial<IUser>; relations?: string[] }): Promise<IUser> {
    const user = await this.userRepository.findOne({ where: options?.where, relations: options?.relations });
    if (!user) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
    return user;
  }

  async saveUser(dto: Pick<IUser, 'id'> & Partial<IUser>): Promise<IUser> {
    const user = await this.userRepository.findOne({ where: { id: dto.id } });
    if (!user) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
    return await this.userRepository.save({ ...user, ...dto });
  }

  async updateUser(dto: Pick<IUser, 'id'> & Partial<IUser>): Promise<void> {
    const result = await this.userRepository.update({ id: dto.id }, dto);
    if (!result.affected) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
  }
}
