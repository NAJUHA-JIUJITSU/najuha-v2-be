import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { ITemporaryUser } from '../../../modules/users/domain/interface/temporary-user.interface';

/**
 * TemporaryUser.
 *
 * 회원가입이 완료되지 않은 사용자.
 * - 회원가입이 완료되면 User로 이동한다.
 * @namespace TemporaryUser
 */
@Entity('temporary_user')
export class TemporaryUserEntity {
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: ITemporaryUser['id'];

  @Column('varchar', { length: 16, default: 'TEMPORARY_USER' })
  role!: ITemporaryUser['role'];

  @Column('varchar', { length: 16 })
  snsAuthProvider!: ITemporaryUser['snsAuthProvider'];

  @Column('varchar', { length: 256 })
  snsId!: ITemporaryUser['snsId'];

  @Column('varchar', { length: 320 })
  email!: ITemporaryUser['email'];

  @Column('varchar', { length: 256 })
  name!: ITemporaryUser['name'];

  @Column('varchar', { length: 16, nullable: true })
  phoneNumber!: ITemporaryUser['phoneNumber'];

  @Column('varchar', { length: 64, unique: true, nullable: true })
  nickname!: ITemporaryUser['nickname'];

  @Column('varchar', { length: 16, nullable: true })
  gender!: ITemporaryUser['gender'];

  @Column('varchar', { length: 8, nullable: true })
  birth!: ITemporaryUser['birth'];

  @Column('varchar', { length: 16, nullable: true })
  belt!: ITemporaryUser['belt'];

  @Column('varchar', { length: 16, default: 'ACTIVE' })
  status!: ITemporaryUser['status'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: ITemporaryUser['createdAt'];

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: ITemporaryUser['updatedAt'];
}
