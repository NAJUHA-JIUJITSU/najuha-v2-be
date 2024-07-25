import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ParticipationDivisionInfoEntity } from './participation-division-info.entity';
import { DivisionEntity } from '../competition/division.entity';
import { IParticipationDivisionInfoSnapshot } from '../../../modules/applications/domain/interface/participation-division-info-snapshot.interface';
import { uuidv7 } from 'uuidv7';

/**
 * ParticipationDivisionInfoSnapshot.
 *
 * 참가신청에 대한 부문 정보.
 * - 참가신청에 대한 부문 정보가 변경경될때마다 스냅샷을 생성한다.
 * - 결제 이후에만 스냅샷이 저장되고, 결제 이전에 참가 부문 수정시, Application자체를 새로 생성한다.
 * - 해당 entity 를 포함하는 Application이 DONE 상태라면, 최초의 스냅샷이 결제정보로 사용된다.
 * - 마지막 스냅샷이 현제의 참가 부문 정보를 나타낸다.
 * @namespace Application
 */
@Entity('participation_division_info_snapshot')
@Index('IDX_ParticipationDivisionInfoSnapshot_participationDivisionInfoId', ['participationDivisionInfoId'])
export class ParticipationDivisionInfoSnapshotEntity {
  /**
   * UUID v7.
   */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IParticipationDivisionInfoSnapshot['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IParticipationDivisionInfoSnapshot['createdAt'];

  @Column('uuid')
  participationDivisionInfoId!: ParticipationDivisionInfoEntity['id'];

  /**
   * 유저가 참가할 부문 ID.
   */
  @Column('uuid')
  divisionId!: DivisionEntity['id'];

  @ManyToOne(
    () => ParticipationDivisionInfoEntity,
    (participationDivisionInfo) => participationDivisionInfo.participationDivisionInfoSnapshots,
  )
  @JoinColumn({ name: 'participationDivisionInfoId' })
  participationDivisionInfo!: ParticipationDivisionInfoEntity;

  @ManyToOne(() => DivisionEntity, (division) => division.participationDivisionInfoSnapshots)
  @JoinColumn({ name: 'divisionId' })
  division!: DivisionEntity;
}
