import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Division } from './division.entity';
import { ParticipationDivision } from '../application/participation-divsion.entity';

@Entity('price_snapshot')
export class PriceSnapshot {
  /**
   * - price-snapshot id.
   * @type uint32
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * - price, 단위: 원.
   * @type uint32
   * @minimum 0
   */
  @Column('int')
  price: number;

  /**
   * - 엔티티가 데이터베이스에 처음 저장될 때의 생성 시간. 자동으로 설정됩니다.
   */
  @CreateDateColumn()
  createdAt: Date | string;

  /** - division id. */
  @Column()
  divisionId: Division['id'];

  /** - division. */
  @ManyToOne(() => Division, (division) => division.priceSnapshots)
  @JoinColumn({ name: 'divisionId' })
  division?: Division;

  /** - participation division. */
  @OneToMany(() => ParticipationDivision, (participationDivision) => participationDivision.priceSnapshot)
  participationDivisions?: ParticipationDivision[];

  constructor(partial: Partial<PriceSnapshot>) {
    Object.assign(this, partial);
  }
}
