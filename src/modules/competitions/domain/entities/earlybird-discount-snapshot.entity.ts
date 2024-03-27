import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Competition } from './competition.entity';
import { Application } from 'src/modules/applications/domain/entities/application.entity';

@Entity('early_bird_discount_snapshot')
export class EarlybirdDiscountSnapshot {
  /**
   * - ID. 데이터베이스에서 자동 생성됩니다.
   * @type uint32
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * - 얼리버드 시작일
   */
  @Column('timestamp')
  earlyBirdStartDate: Date | string;

  /**
   * - 얼리버드 마감일
   */
  @Column('timestamp')
  earlyBirdEndDate: Date | string;

  /**
   * - 얼리버드 할인 가격 ex) 10000
   * - 단위 : 원
   * - 음수 값은 허용하지 않습니다.
   * @minimum 0
   */
  @Column('int')
  discountAmount: number;

  /** - 생성 시간. 데이터베이스에 엔티티가 처음 저장될 때 자동으로 설정됩니다. */
  @CreateDateColumn()
  createdAt: Date | string;

  /** - competition id. */
  @Column()
  competitionId: Competition['id'];

  /** - competition. */
  @ManyToOne(() => Competition, (competition) => competition.earlybirdDiscountSnapshots)
  @JoinColumn({ name: 'competitionId' })
  competition: Competition;

  /** - applications. */
  @OneToMany(() => Application, (application) => application.earlybirdDiscountSnapshot)
  applications: Application[];
}
