import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * - 약관 테이블.
 * - 서비스 이용 약관, 개인정보 처리 방침, 환불 정책 등을 저장합니다.
 */
@Entity('policy')
export class PolicyEntity {
  /** - 약관 ID. 데이터베이스에서 자동 생성됩니다. */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * - 약관의 종류.
   * - TERMS_OF_SERVICE: 서비스 이용 약관.
   * - PRIVACY_POLICY: 개인정보 처리 방침.
   * - REFUND_POLICY: 환불 정책.
   */
  @Column('varchar', { length: 50 })
  type: 'TERMS_OF_SERVICE' | 'PRIVACY_POLICY' | 'REFUND_POLICY';

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
  createdAt: Date; // 약관 생성 날짜
}
