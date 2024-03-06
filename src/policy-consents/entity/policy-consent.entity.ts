import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { PolicyEntity } from 'src/policy/entities/policy.entity';

/**
 * - 사용자가 동의한 약관 정보
 */
@Entity('policy_consent')
export class PolicyConsentEntity {
  /** 약관 동의 ID. */
  @PrimaryGeneratedColumn()
  id: number;

  /** 사용자 Id. */
  @Column()
  userId: number;

  /** 약관 ID. */
  @Column()
  policyId: number;

  /** 동의 날짜. */
  @CreateDateColumn()
  createdAt: Date | string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => PolicyEntity)
  @JoinColumn({ name: 'policyId' })
  policy: PolicyEntity;
}
