import { UserEntity } from 'src/infrastructure/database/entities/user/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApplicationEntity } from './application.entity';
import { ApplicationPackageSnapshotEntity } from './application-package-snapshot.entity';
import { CompetitionEntity } from './competition.entity';

@Entity('application_package')
export class ApplicationPackageEntity {
  /**
   * - application package id.
   * @type uint32
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * - 주짓수 네트워크.
   * @minLength 1
   * @maxLength 64
   * @patter ^[a-zA-Z0-9ㄱ-ㅎ가-힣 ]{1,64}$
   */
  @Column('varchar', { length: 64 })
  network: string;

  /**
   * - 소속 팀.
   * @minLength 1
   * @maxLength 64
   * @patter ^[a-zA-Z0-9ㄱ-ㅎ가-힣 ]{1,64}$
   */
  @Column('varchar', { length: 64 })
  team: string;

  /**
   * - 관장님 성함.
   * @minLength 1
   * @maxLength 64
   * @patter ^[a-zA-Z0-9ㄱ-ㅎ가-힣 ]{1,64}$
   */
  @Column('varchar', { length: 64 })
  masterName: string;

  /** - 신청시간. */
  @CreateDateColumn()
  createdAt: Date | string;

  /**
   * - application 정보
   * - OneToMany: Application(1) -> ApplicationPackage(*)
   */
  @OneToMany(() => ApplicationEntity, (application) => application.applicationPackage)
  applications?: ApplicationEntity[];

  /**
   * - application package snapshot 정보
   * - OneToMany: ApplicationPackage(1) -> ApplicationPackageSnapshot(*)
   */
  @OneToMany(
    () => ApplicationPackageSnapshotEntity,
    (applicationPackageSnapshot) => applicationPackageSnapshot.applicationPackage,
  )
  applicationPackageSnapshots?: ApplicationPackageSnapshotEntity[];

  /**
   * - competition id.
   */
  @Column()
  competitionId: CompetitionEntity['id'];

  /**
   * - competition 정보
   * - ManyToOne: Competition(1) -> ApplicationPackage(*)
   * - JoinColumn: competitionId
   */
  @ManyToOne(() => CompetitionEntity, (competition) => competition.applicationPackages)
  @JoinColumn({ name: 'competitionId' })
  competition?: CompetitionEntity;

  /**
   * - 신청자 계정 id.
   */
  @Column()
  userId: UserEntity['id'];

  /**
   * - 신청자 계정 정보
   * - ManyToOne: User(1) -> Application(*)
   * - JoinColumn: userId
   */
  @ManyToOne(() => UserEntity, (user) => user.applicationPackages)
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  //   /*
  //    * - cancel 정보
  //    */
  //   cancle?: Cancel;

  // transactions

  //   /*
  //    * - cancel 정보
  //    */
  //   cancle?: Cancel;

  // transactions
}
