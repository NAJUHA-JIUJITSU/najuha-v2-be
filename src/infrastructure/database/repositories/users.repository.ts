import { Injectable } from '@nestjs/common';
import { BusinessException } from 'src/common/response/errorResponse';
import { UsersErrorMap } from 'src/common/response/errorResponse';
import { UserEntity } from 'src/infrastructure/database/entities/user.entity';
import { ITemporaryUser } from 'src/interfaces/temporary-user.interface';
import { IUser } from 'src/interfaces/user.interface';
import { DataSource, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async saveOrFail(dto: Pick<IUser, 'id'> & Partial<IUser>): Promise<IUser> {
    const user = await this.findOne({ where: { id: dto.id } });
    if (!user) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
    return await this.save({ ...user, ...dto });
  }

  async updateOrFail(dto: Pick<IUser, 'id'> & Partial<IUser>): Promise<void> {
    const result = await this.update({ id: dto.id }, dto);
    if (!result.affected) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
  }

  async getOneOrFail({ where, relations }: FindOneOptions<IUser>): Promise<IUser> {
    const user = await this.findOne({ where, relations });
    if (!user) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
    return user;
  }

  async getTemporaryUserOrFail(userId: IUser['id']): Promise<ITemporaryUser> {
    const user = await this.findOne({ where: { id: userId } });
    if (!user) throw new BusinessException(UsersErrorMap.USERS_USER_NOT_FOUND);
    return user;
  }
}
