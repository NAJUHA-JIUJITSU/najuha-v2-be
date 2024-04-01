import { Injectable } from '@nestjs/common';
import { BusinessException, CommonErrorMap } from 'src/common/response/errorResponse';
import { Repository } from 'typeorm';
import { Competition } from '../../infrastructure/database/entities/competition/competition.entity';
import { Application } from '../../infrastructure/database/entities/application/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../infrastructure/database/entities/user/user.entity';
import { IUser } from '../users/domain/structure/user.interface';
import { ICompetition } from '../competitions/domain/structure/competition.interface';
import { IApplication } from './domain/structure/application.interface';

@Injectable()
export class ApplicationRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Competition)
    private readonly competitionRepository: Repository<Competition>,
  ) {}

  // ----------------- User -----------------
  async getUser(userId: IUser['id']): Promise<IUser> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'User not found');
    return user;
  }

  // ----------------- Competition -----------------
  async getCompetition(id: ICompetition['id']): Promise<ICompetition> {
    const competition = await this.competitionRepository.findOne({
      where: { id, status: 'ACTIVE' },
      relations: [
        'divisions',
        'divisions.priceSnapshots',
        'earlybirdDiscountSnapshots',
        'combinationDiscountSnapshots',
      ],
    });
    if (!competition) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'Competition not found');
    return competition;
  }

  // ----------------- Application -----------------
  async saveApplication(application: IApplication): Promise<IApplication> {
    return this.applicationRepository.save(application);
  }

  async getApplication(id: IApplication['id']): Promise<IApplication> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['participationDivisions', 'participationDivisions.participationDivisionSnapshots'],
    });
    if (!application) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'Application not found');
    return application;
  }
}
