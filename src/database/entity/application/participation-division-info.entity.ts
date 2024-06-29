import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { ParticipationDivisionInfoSnapshotEntity } from './participation-division-info-snapshot.entity';
import { ApplicationEntity } from './application.entity';
import { IParticipationDivisionInfo } from '../../../modules/applications/domain/interface/participation-division-info.interface';
import { ParticipationDivisionInfoPaymentMapEntity } from './participation-division-info-payment-map.entity';
import { IApplication } from '../../../modules/applications/domain/interface/application.interface';
import { uuidv7 } from 'uuidv7';
import { PriceSnapshotEntity } from '../competition/price-snapshot.entity';
import { DivisionEntity } from '../competition/division.entity';

/**
 * ParticipationDivisionInfoEntity
 * @namespace Application
 */
@Entity('participation_division_info')
@Index('IDX_ParticipationDivisionInfo_applicationId', ['applicationId'])
export class ParticipationDivisionInfoEntity {
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IParticipationDivisionInfo['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IParticipationDivisionInfo['createdAt'];

  @Column('uuid')
  applicationId!: IApplication['id'];

  @Column('uuid', { nullable: true })
  payedDivisionId!: IParticipationDivisionInfo['payedDivisionId'];

  @Column('uuid', { nullable: true })
  payedPriceSnapshotId!: IParticipationDivisionInfo['payedPriceSnapshotId'];

  // -----------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------
  @ManyToOne(() => ApplicationEntity, (application) => application.participationDivisionInfos)
  @JoinColumn({ name: 'applicationId' })
  application!: ApplicationEntity;

  /**
   * @minitems 1
   */
  @OneToMany(
    () => ParticipationDivisionInfoSnapshotEntity,
    (participationDivisionInfoSnapshot) => participationDivisionInfoSnapshot.participationDivisionInfo,
    { cascade: true },
  )
  participationDivisionInfoSnapshots!: ParticipationDivisionInfoSnapshotEntity[];

  @ManyToOne(() => DivisionEntity, (division) => division.participationDivisionInfos, { nullable: true })
  @JoinColumn({ name: 'payedDivisionId' })
  payedDivision!: DivisionEntity | null;

  @ManyToOne(() => PriceSnapshotEntity, (priceSnapshot) => priceSnapshot.participationDivisionInfos, { nullable: true })
  @JoinColumn({ name: 'payedPriceSnapshotId' })
  payedPriceSnapshot!: PriceSnapshotEntity | null;

  @OneToMany(() => ParticipationDivisionInfoPaymentMapEntity, (map) => map.participationDivisionInfo)
  participationDivisionInfoPaymentMaps!: ParticipationDivisionInfoPaymentMapEntity[];
}
