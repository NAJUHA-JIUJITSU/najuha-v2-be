import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { ICombinationDiscountRule } from '../../../../modules/competitions/domain/structure/combination-discount-rule.interface';
import { ApplicationEntity } from 'src/infrastructure/database/entities/application/application.entity';

@Entity('combination_discount_snapshot')
export class CombinationDiscountSnapshotEntity {
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
  competitionId: CompetitionEntity['id'];

  /** - competition. */
  @ManyToOne(() => CompetitionEntity, (competition) => competition.combinationDiscountSnapshots)
  @JoinColumn({ name: 'competitionId' })
  competition: CompetitionEntity;

  /** - applications. */
  @OneToMany(() => ApplicationEntity, (application) => application.combinationDiscountSnapshot)
  applications: ApplicationEntity[];
}
