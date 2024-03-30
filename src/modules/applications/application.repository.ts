import { Injectable } from '@nestjs/common';
import { BusinessException, CommonErrorMap } from 'src/common/response/errorResponse';
import { Repository } from 'typeorm';
import { Competition } from '../../infrastructure/database/entities/competition/competition.entity';
import { Application } from '../../infrastructure/database/entities/application/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../infrastructure/database/entities/user/user.entity';
import { IUser } from '../users/domain/user.interface';

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
  async getCompetition(id: Competition['id']): Promise<Competition> {
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
  async saveApplication(application: Application): Promise<Application> {
    return this.applicationRepository.save(application);
  }

  async getApplication(id: Application['id']): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['participationDivisions', 'participationDivisions.participationDivisionSnapshots'],
    });
    if (!application) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'Application not found');
    return application;
  }
}
