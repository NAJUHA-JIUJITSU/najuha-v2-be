import { Entity, Column, CreateDateColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { PolicyConsentEntity } from '../user/policy-consent.entity';
import { IPolicy } from '../../../modules/policy/domain/interface/policy.interface';
import { uuidv7 } from 'uuidv7';

/**
 * Policy.
 *
 * - 같은 타입의 약관수정이 필요할때는 업데이트가 아닌 새로운 약관을 생성합니다.
 * - 새로운 약관이 생성될 때마다 버전을 올립니다.
 * @namespace User
 */
@Entity('policy')
export class PolicyEntity {
  /** UUID v7. */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IPolicy['id'];

  /** 약관의 버전. */
  @Column('int', { default: 1 })
  version!: IPolicy['version'];

  /**
   * 약관의 종류.
   * - TERMS_OF_SERVICE: 서비스 이용 약관.
   * - PRIVACY: 개인정보 처리 방침.
   * - REFUND: 환불 정책.
   * - ADVERTISEMENT: 광고정책.
   */
  @Column('varchar', { length: 64 })
  type!: IPolicy['type'];

  /**
   * 약관동의 필수여수.
   * - true: 필수.
   * - false: 선택.
   */
  @Column('boolean', { default: false })
  isMandatory!: IPolicy['isMandatory'];

  /**
   * 약관의 제목.
   * - ex) 서비스 이용 약관, 개인정보 처리 방침, 환불 정책.
   */
  @Column('varchar', { length: 128 })
  title!: IPolicy['title'];

  /**
   * 약관의 내용.
   * - ex) 서비스 이용 약관, 개인정보 처리 방침, 환불 정책.
   */
  @Column('text')
  content!: IPolicy['content'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IPolicy['createdAt'];

  @OneToMany(() => PolicyConsentEntity, (policyConsent) => policyConsent.policy)
  policyConsents!: PolicyConsentEntity[];
}
