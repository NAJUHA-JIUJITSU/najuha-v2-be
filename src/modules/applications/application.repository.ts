import { Injectable } from '@nestjs/common';
import { BusinessException, CommonErrorMap } from 'src/common/response/errorResponse';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTable } from '../../infrastructure/database/tables/user/user.entity';
import { IUser } from '../users/domain/interface/user.interface';
import { ICompetition } from '../competitions/domain/interface/competition.interface';
import { IApplication } from './domain/interface/application.interface';
import { CompetitionTable } from 'src/infrastructure/database/tables/competition/competition.table';
import { ParticipationDivisionInfoTable } from 'src/infrastructure/database/tables/application/participation-division-info.table';
import { IParticipationDivisionInfo } from './domain/interface/participation-division-info.interface';
import { PlayerSnapshotTable } from 'src/infrastructure/database/tables/application/player-snapshot.table';
import { ParticipationDivisionInfoSnapshotTable } from 'src/infrastructure/database/tables/application/participation-division-info-snapshot.table';
import { ApplicationEntity } from './domain/entity/application.entity';
import { ParticipationDivisionInfoEntity } from './domain/entity/participation-division-info.entity';
import { PlayerSnapshotEntity } from './domain/entity/player-snapshot.entity';
import { ApplicationTable } from 'src/infrastructure/database/tables/application/application.table';

@Injectable()
export class ApplicationRepository {
  constructor(
    @InjectRepository(UserTable)
    private readonly userRepository: Repository<UserTable>,
    @InjectRepository(ApplicationTable)
    private readonly applicationRepository: Repository<ApplicationTable>,
    @InjectRepository(CompetitionTable)
    private readonly competitionRepository: Repository<CompetitionTable>,
    @InjectRepository(ParticipationDivisionInfoTable)
    private readonly participationDivisionInfoRepository: Repository<ParticipationDivisionInfoTable>,
    @InjectRepository(PlayerSnapshotTable)
    private readonly playerSnapshotRepository: Repository<PlayerSnapshotTable>,
    @InjectRepository(ParticipationDivisionInfoSnapshotTable)
    private readonly participationDivisionInfoSnapshotRepository: Repository<ParticipationDivisionInfoSnapshotTable>,
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

  async deleteParticipationDivisionInfos(participationDivisionInfos: ParticipationDivisionInfoEntity[]): Promise<void> {
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
  async deletePlayerSnapshots(playerSnapshots: PlayerSnapshotEntity[]): Promise<void> {
    playerSnapshots.forEach(async (playerSnapshot) => {
      await this.playerSnapshotRepository.delete(playerSnapshot.id);
    });
  }
  async savePlayerSnapshot(playerSnapshot: PlayerSnapshotEntity): Promise<void> {
    await this.playerSnapshotRepository.save(playerSnapshot);
  }
}
