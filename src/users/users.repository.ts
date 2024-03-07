import { Injectable } from '@nestjs/common';
import { BusinessException } from 'src/common/response/errorResponse';
import { UsersErrorMap } from 'src/common/response/errorResponse';
import { UserEntity } from 'src/users/entities/user.entity';
import { DataSource, FindOneOptions, FindOptions, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async saveOrFail(dto: Pick<UserEntity, 'id'> & Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.findOne({ where: { id: dto.id } });
    if (!user) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
    return await this.save({ ...user, ...dto });
  }

  async updateOrFail(dto: Pick<UserEntity, 'id'> & Partial<UserEntity>): Promise<void> {
    const result = await this.update({ id: dto.id }, dto);
    if (!result.affected) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
  }

  async getOneOrFail({ where, relations }: FindOneOptions<UserEntity>): Promise<UserEntity> {
    const user = await this.findOne({ where, relations });
    if (!user) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
    return user;
  }
}
