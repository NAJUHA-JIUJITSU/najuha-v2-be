import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { ParticipationDivisionInfoSnapshotEntity } from './participation-division-info-snapshot.entity';
import { ApplicationEntity } from './application.entity';
import { IParticipationDivisionInfo } from '../../../modules/applications/domain/interface/participation-division-info.interface';
import { ParticipationDivisionInfoPaymentEntity } from './participation-division-info-payment.entity';
import { IApplication } from '../../../modules/applications/domain/interface/application.interface';
import { uuidv7 } from 'uuidv7';

/**
 * ParticipationDivisionInfo.
 *
 * 참가신청에 대한 부문 정보 식별하는 Entity.
 * - 참가신청에 대한 부문 정보가 변경경될때마다 하위 entity인 ParticipationDivisionInfoSnapshot을 생성한다.
 * @namespace Application
 */
@Entity('participation_division_info')
@Index('IDX_ParticipationDivisionInfo_applicationId', ['applicationId'])
export class ParticipationDivisionInfoEntity {
  /**
   * UUID v7.
   */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IParticipationDivisionInfo['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IParticipationDivisionInfo['createdAt'];

  /**
   * 참가부문 정보 상태.
   * - READY: 결제 대기중
   * - DONE: 결제 완료
   * - CANCELED: 결제 취소
   */
  @Column('varchar', { length: 16, default: 'READY' })
  status!: IParticipationDivisionInfo['status'];

  @Column('uuid')
  applicationId!: IApplication['id'];

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

  @OneToMany(
    () => ParticipationDivisionInfoPaymentEntity,
    (participationDivisionInfoPayment) => participationDivisionInfoPayment.participationDivisionInfo,
  )
  participationDivisionInfoPayments!: ParticipationDivisionInfoPaymentEntity[];
}
