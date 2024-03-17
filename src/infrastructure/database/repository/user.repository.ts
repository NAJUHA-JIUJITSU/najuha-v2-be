import { Injectable } from '@nestjs/common';
import { BusinessException } from 'src/common/response/errorResponse';
import { UsersErrorMap } from 'src/common/response/errorResponse';
import { User } from 'src/modules/users/domain/user.entity';
import { DataSource, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async saveOrFail(dto: Pick<User, 'id'> & Partial<User>): Promise<User> {
    const user = await this.findOne({ where: { id: dto.id } });
    if (!user) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
    return await this.save({ ...user, ...dto });
  }

  async updateOrFail(dto: Pick<User, 'id'> & Partial<User>): Promise<void> {
    const result = await this.update({ id: dto.id }, dto);
    if (!result.affected) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
  }

  async getOneOrFail({ where, relations }: FindOneOptions<User>): Promise<User> {
    const user = await this.findOne({ where, relations });
    if (!user) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
    return user;
  }
}
