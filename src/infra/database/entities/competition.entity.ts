import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('competition')
export class CompetitionEntity {
  /**
   * - 대회의 고유 식별자. 데이터베이스에서 자동으로 생성됩니다.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * - 대회의 이름.
   */
  @Column('varchar', { length: 255 })
  title: string;

  /**
   * - 대회가 열리는 장소.
   */
  @Column('varchar', { length: 255 })
  address: string;

  /**
   * - 대회 날짜.
   */
  @Column('date')
  competitionDate: Date;

  /**
   * - 참가 신청 시작일.
   */
  @Column('date')
  registrationStartDate: Date;

  /**
   * - 참가 신청 마감일.
   */
  @Column('date')
  registrationEndDate: Date;

  /**
   * - 환불 가능 기간 마감일.
   */
  @Column('date')
  refundDeadlineDate: Date;

  /**
   * - 단독 참가자의 부문 조정 시작일.
   * - 부문에 참가자가 한 명만 있는 경우, 해당 참가자를 다른 체급이나 부문으로 조정할 수 있는 기간의 시작을 나타냅니다.
   */
  @Column('date')
  soloRegistrationAdjustmentStartDate: Date;

  /**
   * - 단독 참가자의 부문 조정 마감일.
   */
  @Column('date')
  soloRegistrationAdjustmentEndDate: Date;

  /**
   * - 참가자 명단 공개일.
   */
  @Column('date')
  registrationListOpenDate: Date;

  /**
   * - 대진표 공개일.
   */
  @Column('date')
  bracketOpenDate: Date;

  /**
   * - 대회 상세 정보.
   * - 마크다운 형식으로 작성됩니다.
   */
  @Column('text')
  description: string;

  /**
   * - 대회의 상태를 나타냅니다. 활성(ACTIVE) 또는 비활성(INACTIVE) 상태를 가질 수 있습니다.
   */
  @Column('varchar', { length: 10, default: 'INACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

  /**
   * - 엔티티가 데이터베이스에 처음 저장될 때의 생성 시간. 자동으로 설정됩니다.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * - 엔티티가 수정될 때마다 업데이트되는 최종 업데이트 시간.
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
