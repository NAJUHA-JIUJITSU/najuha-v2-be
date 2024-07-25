import { IAdditionalInfo } from '../../../modules/applications/domain/interface/additional-info.interface';
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { ApplicationEntity } from './application.entity';
import { uuidv7 } from 'uuidv7';

/**
 * AdditionalInfo.
 *
 * 대회사가 참가자에게 요구하는 추가 정보. ex) 주소, 주민등록번호 등
 * 대회사가 요청하지 않은경우 추가 정보를 입력하지 않아도 된다.
 * @namespace Application
 */
@Entity('additional_info')
@Index('IDX_AddtionalInfo_applicationId', ['applicationId'])
export class AdditionalInfoEntity {
  /**
   * UUID v7.
   */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IAdditionalInfo['id'];

  /**
   * createdAt.
   */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IAdditionalInfo['createdAt'];

  /**
   * updatedAt
   */
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: IAdditionalInfo['updatedAt'];

  /**
   * type.
   * - SOCIAL_SECURITY_NUMBER: 주민등록번호
   * - ADDRESS: 주소
   */
  @Column('varchar', { length: 64 })
  type!: IAdditionalInfo['type'];

  /**
   * value. 각 type에 해당하는 값.
   * - SOCIAL_SECURITY_NUMBER: '123456-1234567'
   * - ADDRESS: '서울시 강남구 테헤란로 123'
   */
  @Column('varchar')
  value!: IAdditionalInfo['value'];

  /**
   * Application id.
   */
  @Column('uuid')
  applicationId!: IAdditionalInfo['applicationId'];

  /**
   * Application.
   */
  @ManyToOne(() => ApplicationEntity, (application) => application.additionaInfos)
  application!: ApplicationEntity;
}
