import { Injectable } from '@nestjs/common';
import { BusinessException, CommonErrorMap } from 'src/common/response/errorResponse';
import { In, Repository } from 'typeorm';
import { ApplicationEntity } from '../../infrastructure/database/entities/application/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../infrastructure/database/entities/user/user.entity';
import { IUser } from '../users/domain/interface/user.interface';
import { ICompetition } from '../competitions/domain/interface/competition.interface';
import { IApplication } from './domain/interface/application.interface';
import { CompetitionEntity } from 'src/infrastructure/database/entities/competition/competition.entity';
import { ParticipationDivisionEntity } from 'src/infrastructure/database/entities/application/participation-divsion.entity';
import { IParticipationDivision } from './domain/interface/participation-division.interface';
import { PlayerSnapshotEntity } from 'src/infrastructure/database/entities/application/player-snapshot.entity';
import { ParticipationDivisionSnapshotEntity } from 'src/infrastructure/database/entities/application/participation-division-snapshot.entity';
import { IParticipationDivisionSnapshot } from './domain/interface/participation-division-snapshot.interface';

@Injectable()
export class ApplicationRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,
    @InjectRepository(CompetitionEntity)
    private readonly competitionRepository: Repository<CompetitionEntity>,
    @InjectRepository(ParticipationDivisionEntity)
    private readonly participationDivisionRepository: Repository<ParticipationDivisionEntity>,
    @InjectRepository(PlayerSnapshotEntity)
    private readonly playerSnapshotRepository: Repository<PlayerSnapshotEntity>,
    @InjectRepository(ParticipationDivisionSnapshotEntity)
    private readonly participationDivisionSnapshotRepository: Repository<ParticipationDivisionSnapshotEntity>,
  ) {}

  // ----------------- User -----------------
  async getUser(userId: IUser['id']): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'User not found');
    return user;
  }

  // ----------------- Competition -----------------
  async getCompetition(options?: {
    where?: Partial<Pick<ICompetition, 'id' | 'status'>>;
    relations?: string[];
  }): Promise<CompetitionEntity> {
    const competition = await this.competitionRepository.findOne({
      where: { ...options?.where },
      relations: options?.relations,
    });
    if (!competition) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'Competition not found');
    return competition;
  }

  // ----------------- Application -----------------
  async saveApplication(application: IApplication.Create.Application): Promise<ApplicationEntity> {
    return await this.applicationRepository.save(application);
  }

  async getApplication(options?: {
    where?: Partial<Pick<ApplicationEntity, 'id' | 'userId' | 'status'>>;
    relations?: string[];
  }): Promise<ApplicationEntity> {
    const application = await this.applicationRepository.findOne({
      where: { ...options?.where },
      relations: options?.relations,
    });
    if (!application) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'Application not found');
    return application;
  }

  // ----------------- ParticipationDivision -----------------
  async saveParticipationDivisions(participationDivisions: IParticipationDivision[]): Promise<void> {
    await this.participationDivisionRepository.save(participationDivisions);
  }

  async deleteParticipationDivisions(applicationId: IApplication['id']): Promise<void> {
    await this.participationDivisionRepository.delete({ applicationId });
  }

  // ----------------- ParticipationDivisionSnapshot -----------------
  async deleteParticipationDivisionSnapshot(
    participationDivisionSnapshotId: IParticipationDivisionSnapshot['id'],
  ): Promise<void> {
    await this.participationDivisionSnapshotRepository.delete({ id: participationDivisionSnapshotId });
  }

  // ----------------- PlayerSnapshot -----------------
  async savePlayerSnapshot(playerSnapshot: IApplication.Create.PlayerSnapshot): Promise<void> {
    await this.playerSnapshotRepository.save(playerSnapshot);
  }
}
