import { TId, TDateOrStringDate } from 'src/common/common-types';
import { tags } from 'typia';

/**
 * 약관.
 * - 같은 타입의 약관수정이 필요할때는 업데이트가 아닌 새로운 약관을 생성합니다.
 * - 새로운 약관이 생성될 때마다 버전을 올립니다.
 */
export interface IPolicy {
  /** UUID v7. */
  id: TId;

  /** 약관의 버전. */
  version: number & tags.Type<'uint32'> & tags.Minimum<0>;

  /**
   * 약관의 종류.
   * - TERMS_OF_SERVICE: 서비스 이용 약관.
   * - PRIVACY: 개인정보 처리 방침.
   * - REFUND: 환불 정책.
   * - ADVERTISEMENT: 광고정책.
   */
  type: 'TERMS_OF_SERVICE' | 'PRIVACY' | 'REFUND' | 'ADVERTISEMENT';

  /**
   * 약관동의 필수여수.
   * - true: 필수.
   * - false: 선택.
   */
  isMandatory: boolean;

  /**
   * 약관의 제목.
   * - ex) 서비스 이용 약관, 개인정보 처리 방침, 환불 정책.
   */
  title: string & tags.MinLength<1> & tags.MaxLength<128>;

  /**
   * 약관의 내용.
   * - ex) 서비스 이용 약관, 개인정보 처리 방침, 환불 정책.
   */
  content: string & tags.MinLength<1>;

  /** CreatedAt. */
  createdAt: TDateOrStringDate;
}

export interface IPolicyFindMany extends Omit<IPolicy, 'content'> {}
