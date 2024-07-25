import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  Index,
  PrimaryColumn,
} from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { ICompetition } from '../../../modules/competitions/domain/interface/competition.interface';
import { uuidv7 } from 'uuidv7';
import { IRequiredAdditionalInfo } from '../../../modules/competitions/domain/interface/required-additional-info.interface';

/**
 *  RequiredAdditionalInfo.
 *
 * 대회신청시 추가 정보 입력 규칙.
 * - 대회사가 요청한경우에만 해당 Entity를 생성합니다.
 * @namespace Competition
 */
@Entity('required_additional_info')
@Index('IDX_RequiredAdditionalInfo_competitionId', ['competitionId'])
export class RequiredAdditionalInfoEntity {
  /** UUID v7. */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IRequiredAdditionalInfo['id'];

  /**
   * 추가정보 타입가
   *
   * - SOCIAL_SECURITY_NUMBER : 주민등록번호
   * - ADDRESS : 주소
   */
  @Column('varchar', { length: 64 })
  type!: IRequiredAdditionalInfo['type'];

  /**
   * 추가정보 설명.
   * - 추가 정보를 수집하는 이유등을 설명합니다등
   */
  @Column('varchar', { length: 512 })
  description!: IRequiredAdditionalInfo['description'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IRequiredAdditionalInfo['createdAt'];

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt!: IRequiredAdditionalInfo['deletedAt'];

  @Column('uuid')
  competitionId!: ICompetition['id'];

  @ManyToOne(() => CompetitionEntity, (competition) => competition.requiredAdditionalInfos)
  @JoinColumn({ name: 'competitionId' })
  competition!: CompetitionEntity;
}
