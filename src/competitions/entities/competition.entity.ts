import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('competition')
export class CompetitionEntity {
  /**
   * - Competition ID. 데이터베이스에서 자동 생성됩니다.
   * @type uint32
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**- 활성, 비활성 등을 나타냅니다. */
  @Column('varchar', { length: 10, default: 'ACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

  /** - 생성 시간. 데이터베이스에 엔티티가 처음 저장될 때 자동으로 설정됩니다. */
  @CreateDateColumn()
  createdAt: Date | string;

  /** - 최종 업데이트 시간. 엔티티가 수정될 때마다 자동으로 업데이트됩니다. */
  @UpdateDateColumn()
  updatedAt: Date | string;
}
