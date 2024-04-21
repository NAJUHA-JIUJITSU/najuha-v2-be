import { Injectable } from '@nestjs/common';
import { BusinessException, CommonErrorMap } from 'src/common/response/errorResponse';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../infrastructure/database/entity/user/user.entity';
import { IUser } from '../users/domain/interface/user.interface';
import { ICompetition } from '../competitions/domain/interface/competition.interface';
import { IApplication } from './domain/interface/application.interface';
import { CompetitionEntity } from 'src/infrastructure/database/entity/competition/competition.entity';
import { ApplicationEntity } from 'src/infrastructure/database/entity/application/application.entity';

@Injectable()
export class ApplicationRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,
    @InjectRepository(CompetitionEntity)
    private readonly competitionRepository: Repository<CompetitionEntity>,
  ) {}

  // ----------------- User -----------------
  async getUser(userId: IUser['id']): Promise<IUser> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'User not found');
    return user;
  }

  // ----------------- Competition -----------------
  async getCompetition(options?: {
    where?: Partial<Pick<ICompetition, 'id' | 'status'>>;
    relations?: string[];
  }): Promise<ICompetition> {
    const competition = await this.competitionRepository.findOne({
      where: { ...options?.where },
      relations: options?.relations,
    });
    if (!competition) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'Competition not found');
    return competition;
  }

  // ----------------- Application -----------------
  async saveApplication(application: IApplication): Promise<IApplication> {
    return await this.applicationRepository.save(application);
  }

  async getApplication(options?: {
    where?: Partial<Pick<IApplication, 'id' | 'userId' | 'status'>>;
    relations?: string[];
  }): Promise<IApplication> {
    const application = await this.applicationRepository.findOne({
      where: { ...options?.where },
      relations: options?.relations,
    });
    if (!application) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'Application not found');
    return application;
  }
}
