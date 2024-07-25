import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ApplicationEntity } from './application.entity';
import { IPlayerSnapshot } from '../../../modules/applications/domain/interface/player-snapshot.interface';
import { uuidv7 } from 'uuidv7';

/**
 * PlayerSnapshot.
 *
 * 주짓수 대회 참가자의 정보 스냅샷.
 * - 대회 참가자의 정보를 스냅샷하여 저장합니다.
 * - 대회 참가자의 정보는 변경될때마다 스냅샷을 생성합니다. (변경 이력 추적)
 * @namespace Application
 */
@Entity('player_snapshot')
@Index('IDX_PlayerSnapshot_applicationId', ['applicationId'])
export class PlayerSnapshotEntity {
  /**
   * UUID v7.
   */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IPlayerSnapshot['id'];

  /**
   * 선수 이름. (한글, 영문, 숫자, 공백 입력 가능합니다).
   */
  @Column('varchar', { length: 64 })
  name!: IPlayerSnapshot['name'];

  /** 선수 성별. */
  @Column('varchar', { length: 16 })
  gender!: IPlayerSnapshot['gender'];

  /** 선수 생년월일 (BirtDate YYYYMMDD). */
  @Column('varchar', { length: 64 })
  birth!: IPlayerSnapshot['birth'];

  /** 선수 휴대폰 번호. ex) 01012345678. */
  @Column('varchar', { length: 16 })
  phoneNumber!: IPlayerSnapshot['phoneNumber'];

  /** 선수 주짓수 벨트. */
  @Column('varchar', { length: 16 })
  belt!: IPlayerSnapshot['belt'];

  /** 주짓수 네트워크. (한글, 영문, 숫자, 공백 입력 가능합니다). */
  @Column('varchar', { length: 64 })
  network!: IPlayerSnapshot['network'];

  /** 소속 팀. (한글, 영문, 숫자, 공백 입력 가능합니다). */
  @Column('varchar', { length: 64 })
  team!: IPlayerSnapshot['team'];

  /** 관장님 성함. */
  @Column('varchar', { length: 64 })
  masterName!: IPlayerSnapshot['masterName'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IPlayerSnapshot['createdAt'];

  @Column('uuid')
  applicationId!: ApplicationEntity['id'];

  @ManyToOne(() => ApplicationEntity, (application) => application.playerSnapshots)
  @JoinColumn({ name: 'applicationId' })
  application!: ApplicationEntity;
}
