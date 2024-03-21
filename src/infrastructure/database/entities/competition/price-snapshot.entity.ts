import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { DivisionEntity } from './division.entity';

@Entity('price-snapshot')
export class PriceSnapshotEntity {
  /**
   * - price-snapshot id.
   * @type uint32
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * - price, 단위: 원.
   * @type uint32
   */
  @Column('int')
  price: number;

  /**
   * - 엔티티가 데이터베이스에 처음 저장될 때의 생성 시간. 자동으로 설정됩니다.
   */
  @CreateDateColumn()
  createdAt: Date | string;

  @Column({ name: 'divisionId' })
  divisionId: number;

  @ManyToOne(() => DivisionEntity, (division) => division.priceSnapshots)
  division?: DivisionEntity;
}
