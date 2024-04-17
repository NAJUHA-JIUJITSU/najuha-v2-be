import { PolicyConsentTable } from 'src/infrastructure/database/tables/user/policy-consent.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApplicationTable } from '../application/application.table';
import { IUser } from 'src/modules/users/domain/interface/user.interface';

@Entity('user')
export class UserTable {
  @PrimaryGeneratedColumn()
  id: IUser['id'];

  @Column('varchar', { length: 16, default: 'TEMPORARY_USER' })
  role: IUser['role'];

  @Column('varchar', { length: 16 })
  snsAuthProvider: IUser['snsAuthProvider'];

  @Column('varchar', { length: 256 })
  snsId: IUser['snsId'];

  @Column('varchar', { length: 320 })
  email: IUser['email'];

  @Column('varchar', { length: 256, nullable: true })
  name: IUser['name'];

  @Column('varchar', { length: 16, nullable: true })
  phoneNumber: IUser['phoneNumber'];

  @Column('varchar', { length: 64, nullable: true, unique: true })
  nickname: IUser['nickname'];

  @Column('varchar', { length: 16, nullable: true })
  gender: IUser['gender'];

  @Column('varchar', { length: 8, nullable: true })
  birth: IUser['birth'];

  @Column('varchar', { length: 16, nullable: true })
  belt: IUser['belt'];

  @Column('varchar', { length: 128, nullable: true })
  profileImageUrlKey: IUser['profileImageUrlKey'];

  @Column('varchar', { length: 16, default: 'ACTIVE' })
  status: IUser['status'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: IUser['createdAt'];

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: IUser['updatedAt'];

  @OneToMany(() => PolicyConsentTable, (policyConsent) => policyConsent.user)
  policyConsents: PolicyConsentTable[];

  @OneToMany(() => ApplicationTable, (application) => application.user)
  applications: ApplicationTable[];
}
