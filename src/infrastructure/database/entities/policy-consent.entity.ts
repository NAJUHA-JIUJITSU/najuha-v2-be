import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { UserEntity } from 'src/infrastructure/database/entities/user.entity';
import { PolicyEntity } from 'src/infrastructure/database/entities/policy.entity';
import { IPolicyConsent } from 'src/interfaces/policy-consent.interface';

/**
 * - 사용자가 동의한 약관 정보
 */
@Entity('policy_consent')
export class PolicyConsentEntity implements IPolicyConsent {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date | string;

  @Column({ name: 'userId' })
  userId: number;

  @Column({ name: 'policyId' })
  policyId: number;

  @ManyToOne(() => UserEntity, (user) => user.policyConsents)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => PolicyEntity, (policy) => policy.policyConsents)
  @JoinColumn({ name: 'policyId' })
  policy: PolicyEntity;
}
