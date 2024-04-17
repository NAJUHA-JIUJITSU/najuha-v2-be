import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { PolicyTable } from 'src/infrastructure/database/tables/policy/policy.entity';
import { UserTable } from './user.entity';
import { IPolicyConsent } from 'src/modules/register/domain/interface/policy-consent.interface';

@Entity('policy_consent')
export class PolicyConsentTable {
  @PrimaryGeneratedColumn()
  id: IPolicyConsent['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: IPolicyConsent['createdAt'];

  @Column()
  userId: UserTable['id'];

  /** - user */
  @ManyToOne(() => UserTable, (user) => user.policyConsents)
  @JoinColumn({ name: 'userId' })
  user: UserTable;

  /** - policyId. */
  @Column()
  policyId: PolicyTable['id'];

  /** - policy */
  @ManyToOne(() => PolicyTable, (policy) => policy.policyConsents)
  @JoinColumn({ name: 'policyId' })
  policy: PolicyTable;
}
