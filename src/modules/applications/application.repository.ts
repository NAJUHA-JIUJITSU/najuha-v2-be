import { Injectable } from '@nestjs/common';
import { BusinessException, CommonErrorMap } from 'src/common/response/errorResponse';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../infrastructure/database/entity/user/user.entity';
import { IUser } from '../users/domain/interface/user.interface';
import { ICompetition } from '../competitions/domain/interface/competition.interface';
import { IApplication } from './domain/interface/application.interface';
import { CompetitionEntity } from 'src/infrastructure/database/entity/competition/competition.entity';
import { ParticipationDivisionInfoEntity } from 'src/infrastructure/database/entity/application/participation-division-info.entity';
import { IParticipationDivisionInfo } from './domain/interface/participation-division-info.interface';
import { PlayerSnapshotEntity } from 'src/infrastructure/database/entity/application/player-snapshot.entity';
import { ParticipationDivisionInfoSnapshotEntity } from 'src/infrastructure/database/entity/application/participation-division-info-snapshot.entity';
import { ParticipationDivisionInfoModel } from './domain/model/participation-division-info.model';
import { PlayerSnapshotModel } from './domain/model/player-snapshot.model';
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
    @InjectRepository(ParticipationDivisionInfoEntity)
    private readonly participationDivisionInfoRepository: Repository<ParticipationDivisionInfoEntity>,
    @InjectRepository(PlayerSnapshotEntity)
    private readonly playerSnapshotRepository: Repository<PlayerSnapshotEntity>,
    @InjectRepository(ParticipationDivisionInfoSnapshotEntity)
    private readonly participationDivisionInfoSnapshotRepository: Repository<ParticipationDivisionInfoSnapshotEntity>,
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

  // ----------------- ParticipationDivisionInfo -----------------
  async saveParticipationDivisionInfos(participationDivisionInfos: IParticipationDivisionInfo[]): Promise<void> {
    await this.participationDivisionInfoRepository.save(participationDivisionInfos);
  }

  async deleteParticipationDivisionInfos(participationDivisionInfos: ParticipationDivisionInfoModel[]): Promise<void> {
    await Promise.all(
      participationDivisionInfos.map(async (participationDivisionInfo) => {
        await Promise.all(
          participationDivisionInfo.participationDivisionInfoSnapshots.map(
            async (participationDivisionInfoSnapshot) => {
              await this.participationDivisionInfoSnapshotRepository.delete(participationDivisionInfoSnapshot.id);
            },
          ),
        );
        await this.participationDivisionInfoRepository.delete(participationDivisionInfo.id);
      }),
    );
  }

  // ----------------- PlayerSnapshot -----------------
  async deletePlayerSnapshots(playerSnapshots: PlayerSnapshotModel[]): Promise<void> {
    playerSnapshots.forEach(async (playerSnapshot) => {
      await this.playerSnapshotRepository.delete(playerSnapshot.id);
    });
  }
  async savePlayerSnapshot(playerSnapshot: PlayerSnapshotModel): Promise<void> {
    await this.playerSnapshotRepository.save(playerSnapshot);
  }
}
