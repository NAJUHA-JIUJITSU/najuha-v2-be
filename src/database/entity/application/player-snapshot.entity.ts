import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApplicationEntity } from './application.entity';
import { IPlayerSnapshot } from 'src/modules/applications/domain/interface/player-snapshot.interface';
import { uuidv7 } from 'uuidv7';

/**
 * PlayerSnapshot Entity
 * @namespace Application
 */
@Entity('player_snapshot')
@Index('IDX_PlayerSnapshot_applicationId', ['applicationId'])
export class PlayerSnapshotEntity {
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IPlayerSnapshot['id'];

  @Column('varchar', { length: 64 })
  name!: IPlayerSnapshot['name'];

  @Column('varchar', { length: 16 })
  gender!: IPlayerSnapshot['gender'];

  @Column('varchar', { length: 64 })
  birth!: IPlayerSnapshot['birth'];

  @Column('varchar', { length: 16 })
  phoneNumber!: IPlayerSnapshot['phoneNumber'];

  @Column('varchar', { length: 16 })
  belt!: IPlayerSnapshot['belt'];

  @Column('varchar', { length: 64 })
  network!: IPlayerSnapshot['network'];

  @Column('varchar', { length: 64 })
  team!: IPlayerSnapshot['team'];

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
