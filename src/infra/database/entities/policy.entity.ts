import { PolicyConsentEntity } from 'src/infra/database/entities/policy-consent.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

/**
 * - 약관 테이블.
 * - 같은 타입의 약관수정이 필요할때는 업데이트가 아닌 새로운 약관을 생성합니다.
 * - 새로운 약관이 생성될 때마다 버전을 올립니다.
 */
@Entity('policy')
export class PolicyEntity {
  /**
   * - 약관 id. 데이터베이스에서 자동 생성됩니다.
   * @type uint32
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * - 약관의 버전.
   * - 버전이 변경될 때마다 새로운 약관으로 간주합니다.
   */
  @Column('int', { default: 1 })
  version: number;

  /**
   * - 약관의 종류.
   * - TERMS_OF_SERVICE: 서비스 이용 약관.
   * - PRIVACY: 개인정보 처리 방침.
   * - REFUND: 환불 정책.
   * - ADVERTISEMENT: 광고정책.
   */
  @Column('varchar', { length: 50 })
  type: 'TERMS_OF_SERVICE' | 'PRIVACY' | 'REFUND' | 'ADVERTISEMENT';

  /**
   * - 약관동의 필수여수
   * - true: 필수
   * - false: 선택
   */
  @Column('boolean', { default: false })
  isMandatory: boolean;

  /**
   * - 약관의 제목. ex) 서비스 이용 약관, 개인정보 처리 방침, 환불 정책.
   * @minLength 1
   * @maxLength 255
   */
  @Column('varchar', { length: 255 })
  title: string; // 약관의 제목

  /**
   * // TODO: html 혹은 markdown 형식으로 저장할지 고민중
   * - 약관의 내용. ex) 서비스 이용 약관, 개인정보 처리 방침, 환불 정책.
   * @minLength 1
   */
  @Column('text')
  content: string; // 약관의 내용

  @CreateDateColumn()
  createdAt: Date | string; // 약관 생성 날짜

  @OneToMany(() => PolicyConsentEntity, (policyConsent) => policyConsent.policy)
  policyConsents?: PolicyConsentEntity[];
}
