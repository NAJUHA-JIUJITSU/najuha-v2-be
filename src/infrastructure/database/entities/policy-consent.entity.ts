import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { UserEntity } from 'src/infrastructure/database/entities/user.entity';
import { PolicyEntity } from 'src/infrastructure/database/entities/policy.entity';

/**
 * - 사용자가 동의한 약관 정보
 */
@Entity('policy_consent')
export class PolicyConsentEntity {
  /**
   * - 약관 동의 ID.
   * @type uint32
   */
  @PrimaryGeneratedColumn()
  id: number;

  /** - 동의 날짜. */
  @CreateDateColumn()
  createdAt: Date | string;

  /** - 사용자 ID. */
  @Column({ name: 'userId' })
  userId: number;

  /**
   * - 사용자 정보
   * - ManyToOne: User(1) -> PolicyConsent(*)
   * - JoinColumn: userId
   */
  @ManyToOne(() => UserEntity, (user) => user.policyConsents)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  /** - 약관 ID. */
  @Column({ name: 'policyId' })
  policyId: number;

  /**
   * - 약관 정보
   * - ManyToOne: Policy(1) -> PolicyConsent(*)
   * - JoinColumn: policyId
   */
  @ManyToOne(() => PolicyEntity, (policy) => policy.policyConsents)
  @JoinColumn({ name: 'policyId' })
  policy: PolicyEntity;
}
