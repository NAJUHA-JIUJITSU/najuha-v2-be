import { IAdditionalInfo } from 'src/modules/applications/domain/interface/additional-info.interface';
import { Column, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn } from 'typeorm';
import { ulid } from 'ulid';
import { ApplicationEntity } from './application.entity';

@Entity('additional_info')
export class AdditionalInfoEntity {
  @Column('varchar', { length: 26, primary: true, default: ulid() })
  id!: IAdditionalInfo['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IAdditionalInfo['createdAt'];

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: IAdditionalInfo['updatedAt'];

  @Column('varchar', { length: 64 })
  type!: IAdditionalInfo['type'];

  @Column('varchar')
  value!: IAdditionalInfo['value'];

  @Column()
  applicationId!: IAdditionalInfo['applicationId'];

  @ManyToOne(() => ApplicationEntity, (application) => application.additionalInfos)
  application!: ApplicationEntity;
}
