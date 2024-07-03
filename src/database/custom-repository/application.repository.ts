import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ApplicationEntity } from '../entity/application/application.entity';
import { ParticipationDivisionInfoEntity } from '../entity/application/participation-division-info.entity';

@Injectable()
export class ApplicationRepository extends Repository<ApplicationEntity> {
  constructor(private dataSource: DataSource) {
    super(ApplicationEntity, dataSource.createEntityManager());
  }

  async findByParticipationDivisionIds(participationDivisionIds: string[], status: string) {
    return this.createQueryBuilder('application')
      .innerJoin(ParticipationDivisionInfoEntity, 'pdi', 'pdi.applicationId = application.id')
      .where('pdi.id IN (:...participationDivisionIds)', { participationDivisionIds })
      .andWhere('application.status = :status', { status: 'DONE' })
      .andWhere('pdi.status = :pdiStatus', { pdiStatus: 'DONE' })
      .getMany();
  }
}
