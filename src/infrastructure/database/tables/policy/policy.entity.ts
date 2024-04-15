import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { PolicyConsentTable } from '../user/policy-consent.entity';
import { IPolicy } from 'src/modules/policy/domain/interface/policy.interface';

@Entity('policy')
export class PolicyTable {
  @PrimaryGeneratedColumn()
  id: IPolicy['id'];

  @Column('int', { default: 1 })
  version: IPolicy['version'];

  @Column('varchar', { length: 64 })
  type: IPolicy['type'];

  @Column('boolean', { default: false })
  isMandatory: IPolicy['isMandatory'];

  @Column('varchar', { length: 128 })
  title: IPolicy['title'];

  @Column('text')
  content: IPolicy['content'];

  @CreateDateColumn()
  createdAt: IPolicy['createdAt'];

  @OneToMany(() => PolicyConsentTable, (policyConsent) => policyConsent.policy)
  policyConsents: PolicyConsentTable[];
}
