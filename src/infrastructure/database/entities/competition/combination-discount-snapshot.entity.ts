import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Competition } from './competition.entity';
import { ICombinationDiscountRule } from '../../../../modules/competitions/domain/structure/combination-discount-rule.interface';
import { Application } from 'src/infrastructure/database/entities/application/application.entity';

@Entity('combination_discount_snapshot')
export class CombinationDiscountSnapshot {
  /**
   * - combination discount snapshot id.
   * @type uint32
   */
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  combinationDiscountRules: ICombinationDiscountRule[];

  /** - 생성 시간. 데이터베이스에 엔티티가 처음 저장될 때 자동으로 설정됩니다. */
  @CreateDateColumn()
  createdAt: Date | string;

  /** - competition id. */
  @Column()
  competitionId: Competition['id'];

  /** - competition. */
  @ManyToOne(() => Competition, (competition) => competition.combinationDiscountSnapshots)
  @JoinColumn({ name: 'competitionId' })
  competition: Competition;

  /** - applications. */
  @OneToMany(() => Application, (application) => application.combinationDiscountSnapshot)
  applications: Application[];
}
