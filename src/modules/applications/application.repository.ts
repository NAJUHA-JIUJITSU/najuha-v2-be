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
import { PaymentSnapshot } from '../competitions/domain/entities/payment-snapshot.entity';

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
    @InjectRepository(PaymentSnapshot)
    private readonly paymentSnapshotRepository: Repository<PaymentSnapshot>,
  ) {}

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

  // ----------------- User -----------------
  async getUser(options?: { where?: Partial<Pick<User, 'id'>> }): Promise<User> {
    const user = await this.userRepository.findOne({
      where: options?.where,
    });
    if (!user) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'User not found');
    return user;
  }

  // ----------------- Application -----------------
  async createApplication(dto: Pick<Application, 'userId' | 'competitionId'>): Promise<Application> {
    const application = this.applicationRepository.create(dto);
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

  // ----------------- PlayerSnapshot -----------------
  async createPlayerSnapshot(
    dto: Pick<
      PlayerSnapshot,
      'applicationId' | 'name' | 'gender' | 'birth' | 'phoneNumber' | 'belt' | 'network' | 'team' | 'masterName'
    >,
  ): Promise<PlayerSnapshot> {
    const player = this.playerSnapshotRepository.create(dto);
    return this.playerSnapshotRepository.save(player);
  }

  // ----------------- ParticipationDivision -----------------
  async createParticipationDivision(dto: Pick<ParticipationDivision, 'applicationId'>): Promise<ParticipationDivision> {
    const participationDivision = this.participationDivisionRepository.create(dto);
    return await this.participationDivisionRepository.save(participationDivision);
  }

  // ----------------- ParticipationDivisionSnapshot -----------------
  async createParticipationDivisionSnapshot(
    dto: Pick<ParticipationDivisionSnapshot, 'participationDivisionId' | 'divisionId'>,
  ): Promise<ParticipationDivisionSnapshot> {
    const participationDivisionSnapshot = this.participationDivisionSnapshotRepository.create(dto);
    return await this.participationDivisionSnapshotRepository.save(participationDivisionSnapshot);
  }

  // ----------------- PaymentSnapshot -----------------
  async createPaymentSnapshot(
    dto: Pick<
      PaymentSnapshot,
      'normalAmount' | 'earlybirdDiscountAmount' | 'combinationDiscountAmount' | 'totalAmount'
    >,
  ): Promise<PaymentSnapshot> {
    const paymentSnapshot = this.paymentSnapshotRepository.create(dto);
    return await this.paymentSnapshotRepository.save(paymentSnapshot);
  }
}
