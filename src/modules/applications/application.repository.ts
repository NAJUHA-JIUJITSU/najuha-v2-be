import { Injectable } from '@nestjs/common';
import { BusinessException, CommonErrorMap } from 'src/common/response/errorResponse';
import { In, Repository } from 'typeorm';
import { Competition } from '../competitions/domain/entities/competition.entity';
import { Application } from './domain/entities/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerSnapshot } from './domain/entities/player-snapshot.entity';
import { User } from '../users/domain/entities/user.entity';
import { ParticipationDivision } from './domain/entities/participation-divsion.entity';
import { ParticipationDivisionSnapshot } from './domain/entities/participation-division-snapshot.entity';

@Injectable()
export class ApplicationRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Competition)
    private readonly competitionRepository: Repository<Competition>,
    @InjectRepository(PlayerSnapshot)
    private readonly playerSnapshotRepository: Repository<PlayerSnapshot>,
    @InjectRepository(ParticipationDivision)
    private readonly participationDivisionRepository: Repository<ParticipationDivision>,
    @InjectRepository(ParticipationDivisionSnapshot)
    private readonly participationDivisionSnapshotRepository: Repository<ParticipationDivisionSnapshot>,
  ) {}

  // ----------------- Competition -----------------
  async getCompetition(options?: {
    where?: Partial<Pick<Competition, 'id' | 'status'>>;
    relations?: string[];
  }): Promise<Competition> {
    const competition = await this.competitionRepository.findOne({
      where: options?.where,
      relations: options?.relations,
    });
    if (!competition) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'Competition not found');
    return competition;
  }

  // ----------------- User -----------------
  async getUser(options?: { where?: Partial<Pick<User, 'id'>> }): Promise<User> {
    const user = await this.userRepository.findOne({
      where: options?.where,
    });
    if (!user) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'User not found');
    return user;
  }

  // ----------------- Application -----------------
  createApplication(
    dto: Pick<
      Application,
      | 'userId'
      | 'competitionId'
      | 'earlybirdDiscountSnapshotId'
      | 'combinationDiscountSnapshotId'
      | 'participationDivisions'
    > & {
      playerSnapshot: PlayerSnapshot;
    },
  ): Application {
    return this.applicationRepository.create(dto);
  }

  saveApplication(application: Partial<Application>): Promise<Application> {
    return this.applicationRepository.save(application);
  }

  // ----------------- PlayerSnapshot -----------------
  createPlayerSnapshot(
    dto: Pick<PlayerSnapshot, 'name' | 'gender' | 'birth' | 'phoneNumber' | 'belt' | 'network' | 'team' | 'masterName'>,
  ): PlayerSnapshot {
    return this.playerSnapshotRepository.create(dto);
  }

  // ----------------- ParticipationDivision -----------------
  createParticipationDivision(
    dto: Pick<ParticipationDivision, 'participationDivisionSnapshots' | 'priceSnapshot'>,
  ): ParticipationDivision {
    return this.participationDivisionRepository.create(dto);
  }

  // ----------------- ParticipationDivisionSnapshot -----------------
  createParticipationDivisionSnapshot(
    dto: Pick<ParticipationDivisionSnapshot, 'division'>,
  ): ParticipationDivisionSnapshot {
    return this.participationDivisionSnapshotRepository.create(dto);
  }
}
