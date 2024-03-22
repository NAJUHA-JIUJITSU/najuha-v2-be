import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { UserEntity } from 'src/infrastructure/database/entities/user/user.entity';
import { PolicyEntity } from 'src/infrastructure/database/entities/policy/policy.entity';

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

  /** - userId. */
  @Column({ name: 'userId' })
  userId: number;

  /** - user */
  @ManyToOne(() => UserEntity, (user) => user.policyConsents)
  user: UserEntity;

  /** - policyId. */
  @Column({ name: 'policyId' })
  policyId: number;

  /** - policy */
  @ManyToOne(() => PolicyEntity, (policy) => policy.policyConsents)
  policy: PolicyEntity;
}
