import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, PrimaryColumn } from 'typeorm';
import { PolicyEntity } from '../policy/policy.entity';
import { UserEntity } from './user.entity';
import { IPolicyConsent } from '../../../modules/register/domain/interface/policy-consent.interface';
import { uuidv7 } from 'uuidv7';

/**
 * PolicyConsent Entity
 * @namespace User
 */
@Entity('policy_consent')
export class PolicyConsentEntity {
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IPolicyConsent['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IPolicyConsent['createdAt'];

  @Column('uuid')
  userId!: UserEntity['id'];

  /** - user */
  @ManyToOne(() => UserEntity, (user) => user.policyConsents)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  /** - policyId. */
  @Column('uuid')
  policyId!: PolicyEntity['id'];

  /** - policy */
  @ManyToOne(() => PolicyEntity, (policy) => policy.policyConsents)
  @JoinColumn({ name: 'policyId' })
  policy!: PolicyEntity;
}
