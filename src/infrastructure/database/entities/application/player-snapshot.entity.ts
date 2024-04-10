import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApplicationEntity } from './application.entity';
import { IPlayerSnapshot } from 'src/modules/applications/domain/interface/player-snapshot.interface';

@Entity('player_snapshot')
export class PlayerSnapshotEntity {
  @Column('varchar', { length: 26, primary: true })
  id: IPlayerSnapshot['id'];

  @Column('varchar', { length: 64 })
  name: IPlayerSnapshot['name'];

  @Column('varchar', { length: 16 })
  gender: IPlayerSnapshot['gender'];

  @Column('varchar', { length: 64 })
  birth: IPlayerSnapshot['birth'];

  @Column('varchar', { length: 16 })
  phoneNumber: IPlayerSnapshot['phoneNumber'];

  @Column('varchar', { length: 16 })
  belt: IPlayerSnapshot['belt'];

  @Column('varchar', { length: 64 })
  network: IPlayerSnapshot['network'];

  @Column('varchar', { length: 64 })
  team: IPlayerSnapshot['team'];

  @Column('varchar', { length: 64 })
  masterName: IPlayerSnapshot['masterName'];

  @CreateDateColumn()
  createdAt: IPlayerSnapshot['createdAt'];

  @Column()
  applicationId: ApplicationEntity['id'];

  /** - application 정보 */
  @ManyToOne(() => ApplicationEntity, (application) => application.playerSnapshots)
  application: ApplicationEntity;

  // /**
  //  * - division id.
  //  */
  // @Column()
  // divisionId: Division['id'];

  // /**
  //  * - division 정보
  //  * - ManyToOne: Division(1) -> ApplicationEntity(*)
  //  * - JoinColumn: divisionId
  //  */
  // @ManyToOne(() => Division, (division) => division.applicationSnapshots)
  // @JoinColumn({ name: 'divisionId' })
  // division: Division;
}
