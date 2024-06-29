import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { DivisionEntity } from './division.entity';
import { uuidv7 } from 'uuidv7';
import { IPriceSnapshot } from '../../../modules/competitions/domain/interface/price-snapshot.interface';
import { ParticipationDivisionInfoEntity } from '../application/participation-division-info.entity';

/**
 * PriceSnapshot Entity
 * @namespace Competition
 * @erd Application
 */
@Entity('price_snapshot')
@Index('IDX_PriceSnapshot_divisionId', ['divisionId'])
export class PriceSnapshotEntity {
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IPriceSnapshot['id'];

  @Column('int')
  price!: IPriceSnapshot['price'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IPriceSnapshot['createdAt'];

  @Column('uuid')
  divisionId!: DivisionEntity['id'];

  @ManyToOne(() => DivisionEntity, (division) => division.priceSnapshots)
  @JoinColumn({ name: 'divisionId' })
  division!: DivisionEntity;

  @OneToMany(
    () => ParticipationDivisionInfoEntity,
    (participationDivisionInfo) => participationDivisionInfo.payedPriceSnapshot,
  )
  participationDivisionInfos!: ParticipationDivisionInfoEntity[];
}
