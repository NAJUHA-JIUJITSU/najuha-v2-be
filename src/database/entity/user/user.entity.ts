import { PolicyConsentEntity } from 'src//database/entity/user/policy-consent.entity';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApplicationEntity } from '../application/application.entity';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { uuidv7 } from 'uuidv7';
import { CompetitionHostMapEntity } from '../competition/competition-host.entity';

/**
 * User Entity
 * @namespace User
 * @erd Competition
 * @erd Application
 */
@Entity('user')
export class UserEntity {
  @Column('varchar', { length: 36, primary: true, default: uuidv7() })
  id!: IUser['id'];

  @Column('varchar', { length: 16, default: 'TEMPORARY_USER' })
  role!: IUser['role'];

  @Column('varchar', { length: 16 })
  snsAuthProvider!: IUser['snsAuthProvider'];

  @Column('varchar', { length: 256 })
  snsId!: IUser['snsId'];

  @Column('varchar', { length: 320 })
  email!: IUser['email'];

  @Column('varchar', { length: 256 })
  name!: IUser['name'];

  @Column('varchar', { length: 16, nullable: true })
  phoneNumber!: IUser['phoneNumber'] | null;

  @Column('varchar', { length: 64, nullable: true, unique: true })
  nickname!: IUser['nickname'] | null;

  @Column('varchar', { length: 16, nullable: true })
  gender!: IUser['gender'] | null;

  @Column('varchar', { length: 8, nullable: true })
  birth!: IUser['birth'] | null;

  @Column('varchar', { length: 16, nullable: true })
  belt!: IUser['belt'] | null;

  @Column('varchar', { length: 128, nullable: true })
  profileImageUrlKey!: IUser['profileImageUrlKey'];

  @Column('varchar', { length: 16, default: 'ACTIVE' })
  status!: IUser['status'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IUser['createdAt'];

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: IUser['updatedAt'];

  @OneToMany(() => PolicyConsentEntity, (policyConsent) => policyConsent.user, { cascade: true })
  policyConsents!: PolicyConsentEntity[];

  @OneToMany(() => ApplicationEntity, (application) => application.user)
  applications!: ApplicationEntity[];

  @OneToMany(() => CompetitionHostMapEntity, (competitionHost) => competitionHost.user)
  competitionHostMaps!: CompetitionHostMapEntity[];
}
