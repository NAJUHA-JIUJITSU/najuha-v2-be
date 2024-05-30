import { Entity, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { PolicyConsentEntity } from '../user/policy-consent.entity';
import { IPolicy } from 'src/modules/policy/domain/interface/policy.interface';
import { uuidv7 } from 'uuidv7';

/**
 * Policy Entity
 * @namespace User
 */
@Entity('policy')
export class PolicyEntity {
  @Column('varchar', { length: 36, primary: true, default: uuidv7() })
  id!: IPolicy['id'];

  @Column('int', { default: 1 })
  version!: IPolicy['version'];

  @Column('varchar', { length: 64 })
  type!: IPolicy['type'];

  @Column('boolean', { default: false })
  isMandatory!: IPolicy['isMandatory'];

  @Column('varchar', { length: 128 })
  title!: IPolicy['title'];

  @Column('text')
  content!: IPolicy['content'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IPolicy['createdAt'];

  @OneToMany(() => PolicyConsentEntity, (policyConsent) => policyConsent.policy)
  policyConsents!: PolicyConsentEntity[];
}
