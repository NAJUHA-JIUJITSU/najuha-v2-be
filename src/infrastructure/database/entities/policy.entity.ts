import { PolicyConsentEntity } from 'src/infrastructure/database/entities/policy-consent.entity';
import { IPolicy } from 'src/interfaces/policy.interface';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('policy')
export class PolicyEntity implements IPolicy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { default: 1 })
  version: number;

  @Column('varchar', { length: 64 })
  type: 'TERMS_OF_SERVICE' | 'PRIVACY' | 'REFUND' | 'ADVERTISEMENT';

  @Column('boolean', { default: false })
  isMandatory: boolean;

  @Column('varchar', { length: 128 })
  title: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date | string;

  @OneToMany(() => PolicyConsentEntity, (policyConsent) => policyConsent.policy)
  policyConsents?: PolicyConsentEntity[];
}
