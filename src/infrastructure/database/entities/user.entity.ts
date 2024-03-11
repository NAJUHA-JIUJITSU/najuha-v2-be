import { BirthDate } from 'src/common/typia-custom-tags/birth-date.tag';
import { PolicyConsentEntity } from 'src/infrastructure/database/entities/policy-consent.entity';
import { IUser } from 'src/interfaces/user.interface';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('user')
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 50, default: 'TEMPORARY_USER' })
  role: 'ADMIN' | 'USER' | 'TEMPORARY_USER';

  @Column('varchar', { length: 50 })
  snsAuthProvider: 'KAKAO' | 'NAVER' | 'GOOGLE' | 'APPLE'; //TODO: enum으로 변경?

  @Column('varchar', { length: 256 })
  snsId: string;

  @Column({ length: 320 })
  email: string;

  @Column('varchar', { length: 256, nullable: true })
  name: string;

  @Column('varchar', { length: 20, nullable: true })
  phoneNumber: string;

  @Column('varchar', { length: 128, nullable: true, unique: true })
  nickname: string;

  @Column('varchar', { nullable: true })
  gender: 'MALE' | 'FEMALE';

  @Column('varchar', { length: 8, nullable: true })
  birth: string & BirthDate;

  @Column('varchar', { length: 10, nullable: true })
  belt: '선택없음' | '화이트' | '블루' | '퍼플' | '브라운' | '블랙';

  @Column('varchar', { length: 1024, nullable: true })
  profileImageUrlKey: null | string;

  @Column('varchar', { length: 10, default: 'ACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

  @CreateDateColumn()
  createdAt: Date | string;

  @UpdateDateColumn()
  updatedAt: Date | string;

  @OneToMany(() => PolicyConsentEntity, (policyConsent) => policyConsent.user)
  policyConsents?: PolicyConsentEntity[];
}
