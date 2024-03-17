import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from 'src/modules/users/domain/user.entity';
import { Policy } from 'src/modules/policy/domain/policy.entity';

/**
 * - 사용자가 동의한 약관 정보
 */
@Entity('policy_consent')
export class PolicyConsent {
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
  @ManyToOne(() => User, (user) => user.policyConsents)
  @JoinColumn({ name: 'userId' })
  user: User;

  /** - policyId. */
  @Column({ name: 'policyId' })
  policyId: number;

  /** - policy */
  @ManyToOne(() => Policy, (policy) => policy.policyConsents)
  @JoinColumn({ name: 'policyId' })
  policy: Policy;
}
