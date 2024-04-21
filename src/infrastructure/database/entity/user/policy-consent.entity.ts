import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { PolicyEntity } from 'src/infrastructure/database/entity/policy/policy.entity';
import { UserEntity } from './user.entity';
import { IPolicyConsent } from 'src/modules/register/domain/interface/policy-consent.interface';

@Entity('policy_consent')
export class PolicyConsentEntity {
  @PrimaryGeneratedColumn()
  id!: IPolicyConsent['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IPolicyConsent['createdAt'];

  @Column()
  userId!: UserEntity['id'];

  /** - user */
  @ManyToOne(() => UserEntity, (user) => user.policyConsents)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  /** - policyId. */
  @Column()
  policyId!: PolicyEntity['id'];

  /** - policy */
  @ManyToOne(() => PolicyEntity, (policy) => policy.policyConsents)
  @JoinColumn({ name: 'policyId' })
  policy!: PolicyEntity;
}
