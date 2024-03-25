import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BirthDate } from 'src/common/typia-custom-tags/birth-date.tag';
import { Application } from './application.entity';

@Entity('player_snapshot')
export class PlayerSnapshot {
  /**
   * - player snapshot id.
   * @type uint32
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * - player name.
   * @minLength 1
   * @maxLength 64
   * @patter ^[a-zA-Z0-9ㄱ-ㅎ가-힣 ]{1,64}$
   */
  @Column('varchar', { length: 64 })
  playerName: string;

  /** -player gender */
  @Column('varchar', { length: 64 })
  playerGender: 'MALE' | 'FEAMLE';

  /**
   * - player birth (BirtDate YYYYMMDD).
   * @pattern ^[0-9]{8}$
   */
  @Column('varchar', { length: 64 })
  playerBirth: string & BirthDate;

  /**
   * - player phone number.
   * - ex) 01012345678.
   * @pattern ^01[0-9]{9}$
   */
  @Column('varchar', { length: 16 })
  playerPhoneNumber: string;

  /** - player belt */
  @Column('varchar', { length: 16 })
  playerBelt: '화이트' | '블루' | '퍼플' | '브라운' | '블랙';

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

  /** - 엔티티가 데이터베이스에 처음 저장될 때의 생성 시간. 자동으로 설정됩니다. */
  @CreateDateColumn()
  createdAt: Date | string;

  /** - application id. */
  @Column()
  applicationId: Application['id'];

  /** - application 정보 */
  @ManyToOne(() => Application, (application) => application.playerSnapshots)
  application?: Application;

  // /**
  //  * - division id.
  //  */
  // @Column()
  // divisionId: Division['id'];

  // /**
  //  * - division 정보
  //  * - ManyToOne: Division(1) -> Application(*)
  //  * - JoinColumn: divisionId
  //  */
  // @ManyToOne(() => Division, (division) => division.applicationSnapshots)
  // @JoinColumn({ name: 'divisionId' })
  // division?: Division;
}
