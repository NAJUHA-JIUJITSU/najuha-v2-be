import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Policy } from 'src/infrastructure/database/entities/policy/policy.entity';
import { UserEntity } from './user.entity';

/** - 사용자가 동의한 약관 정보. */
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
  @Column()
  userId: number;

  /** - user */
  @ManyToOne(() => UserEntity, (user) => user.policyConsents)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  /** - policyId. */
  @Column()
  policyId: number;

  /** - policy */
  @ManyToOne(() => Policy, (policy) => policy.policyConsents)
  @JoinColumn({ name: 'policyId' })
  policy: Policy;
}
