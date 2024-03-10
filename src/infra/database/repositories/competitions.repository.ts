import { Injectable } from '@nestjs/common';
import { BusinessException } from 'src/common/response/errorResponse';
import { UserEntity } from 'src/infra/database/entities/user.entity';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { CompetitionEntity } from '../entities/competition.entity';

@Injectable()
export class CompetitionsRepository extends Repository<CompetitionEntity> {
  constructor(private dataSource: DataSource) {
    super(CompetitionEntity, dataSource.createEntityManager());
  }

  //   async saveOrFail(dto: Pick<UserEntity, 'id'> & Partial<UserEntity>): Promise<UserEntity> {
  //     const user = await this.findOne({ where: { id: dto.id } });
  //     if (!user) throw new BusinessException(CompetitionsErrorMap.USERS_USER_NOT_FOUND);
  //     return await this.save({ ...user, ...dto });
  //   }

  //   async updateOrFail(dto: Pick<UserEntity, 'id'> & Partial<UserEntity>): Promise<void> {
  //     const result = await this.update({ id: dto.id }, dto);
  //     if (!result.affected) throw new BusinessException(CompetitionsErrorMap.USERS_USER_NOT_FOUND);
  //   }

  //   async getOneOrFail({ where, relations }: FindOneOptions<UserEntity>): Promise<UserEntity> {
  //     const user = await this.findOne({ where, relations });
  //     if (!user) throw new BusinessException(CompetitionsErrorMap.USERS_USER_NOT_FOUND);
  //     return user;
  //   }
}
